import moment from 'moment';
import { Prisma } from '@prisma/client';
import { IBasicTripService } from '../interfaces/basicTripService';
import prisma from '../../prisma/client';
import {
  BasicTripQueryType,
  CalculateTripPrice,
  CancelBasicTrip,
  CreateBasicTrip,
  JoinBasicTrip,
  JoinBasicTripType,
  TripBillingDetails,
  TripPrice,
} from '../types/basicTripType';
import {
  PassengerTripStatus,
  TripSorting,
  TripStatus,
  TripType,
} from '../enum/trip';
import { PaymentMethod, PaymentStatus } from '../enum/payment';
import ApiError from '../utils/ApiError';
import { TransactionType } from '../enum/wallet';
import meetingLocationService from './mettingLocationService';
import { Location, UpdateUser } from '../types/userType';
import { Language } from '../types/languageType';
import promoCodeService from './promoCodeService';
import {
  DriverCancelationReturn,
  EndTrip,
  UserCancelationReturn,
} from '../types/tripType';
import paymentGatewayService from './paymentGatewayService';
import tripService from './tripService';
import { convertDateToKSA } from '../types/convertDateToKSA';

class BasicTripService implements IBasicTripService {
  async applepayJoin(transactionId: string) {
    const passengerTrip = await prisma.passenger_Trip.findFirst({
      where: {
        transactionId,
      },
    });
    if (!passengerTrip) throw new ApiError('Passenger not found', 404);
    const user = await prisma.user.findUnique({
      where: { id: passengerTrip.passenger_id },
      select: {
        discount_app_share_count: true,
        user_wallet_balance: true,
      },
    });
    if (!user) throw new ApiError('User not found', 404);
    await paymentGatewayService.getPaymentStatus(transactionId);
    // TODO: Figure Out a way to cancel the seat if it fails
    // What i have in mind is to put try catch and then throw the error
    return prisma.$transaction(async (tx) => {
      if (passengerTrip.app_share_discount > 0) {
        await tx.user.update({
          where: { id: passengerTrip.passenger_id },
          data: {
            discount_app_share_count: { decrement: 1 },
          },
        });
      }
      if (passengerTrip.user_debt > 0) {
        await tx.user.update({
          where: { id: passengerTrip.passenger_id },
          data: {
            user_wallet_balance: { increment: passengerTrip.user_debt },
            Passenger_Wallet_Transaction: {
              create: {
                amount: passengerTrip.user_debt,
                current_balance:
                  user.user_wallet_balance + passengerTrip.user_debt,
                previous_balance: user.user_wallet_balance,
                transaction_type: TransactionType.DEBT_PAYMENT,
                trip_id: passengerTrip.trip_id,
              },
            },
          },
        });
      }
      return tx.passenger_Trip.update({
        where: { id: passengerTrip.id },
        data: {
          payment_status: PaymentStatus.SUCCESS,
          status: PassengerTripStatus.JOINED,
        },
      });
    });
  }

  async create(
    data: CreateBasicTrip,
    driver_id: number,
    gender: string,
  ): Promise<any> {
    await this.verifyDestinationAndPickupLocationsExist(
      data.destination_id,
      data.pickup_location_id,
    );

    const trip = await prisma.trip.create({
      data: {
        start_date: new Date(data.start_date),
        end_date: data.end_date ? new Date(data.end_date) : null,
        status: TripStatus.UPCOMING,
        gender,
        driver_id,
        vehicle_id: data.vehicle_id,
        type: TripType.BASICTRIP,
        distance: data.distance,
        features: data.features,
        Basic_Trip: {
          create: {
            seats_no: data.seats_no,
            available_seats_no: data.seats_no,
            price_per_seat: data.price_per_seat,
            destination_id: data.destination_id,
            pickup_location_id: data.pickup_location_id,
          },
        },
      },
      select: {
        id: true,
        start_date: true,
        end_date: true,
        driver_id: true,
        createdAt: true,
        updatedAt: true,
        status: true,
        features: true,
        Basic_Trip: {
          select: {
            seats_no: true,
            available_seats_no: true,
            price_per_seat: true,
            destination_id: true,
            pickup_location_id: true,
          },
        },
      },
    });

    return trip;
  }

  async get(tripId: number, userId: number): Promise<any> {
    const trip = await prisma.trip.findUnique({
      where: {
        id: tripId,
        type: TripType.BASICTRIP,
      },
      select: {
        id: true,
        start_date: true,
        end_date: true,
        driver_id: true,
        createdAt: true,
        updatedAt: true,
        status: true,
        features: true,
        Driver: {
          select: {
            id: true,
            name: true,
            phone: true,
            location: true,
            avatar: true,
            Vehicles: true,
            driver_rate: true,
            Hobbies: true,
          },
        },
        Basic_Trip: {
          select: {
            seats_no: true,
            available_seats_no: true,
            price_per_seat: true,
            destination_id: true,
            pickup_location_id: true,
          },
        },
      },
    });
    if (!trip) throw new ApiError('Trip not found', 404);
    const completedTripsCount = await prisma.trip.count({
      where: {
        driver_id: trip.driver_id,
        status: TripStatus.COMPLETED,
      },
    });
    const isFavoriteDriver = await prisma.favorite_Driver.findUnique({
      where: {
        userId_driverId: {
          userId,
          driverId: trip.driver_id!,
        },
      },
    });

    return {
      ...trip,
      completed_trips_count: completedTripsCount,
      is_favorite_driver: !!isFavoriteDriver,
    };
  }

  async getAll(
    userId: number,
    language: Language,
    gender: string,
    queryString: BasicTripQueryType,
  ): Promise<any> {
    const tripStatus = TripStatus.UPCOMING;
    const tripType = TripType.BASICTRIP;
    const cityPickupId = queryString.cityPickupId
      ? +queryString.cityPickupId
      : undefined;
    const startDate = queryString.startDate
      ? new Date(queryString.startDate)
      : undefined;
    const page = queryString.page ? +queryString.page : 1;
    const limit = queryString.limit ? +queryString.limit : 10;
    const offset = (page - 1) * limit;

    const name = `${language}_name`;
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        Hobbies: {
          select: {
            id: true,
          },
        },
      },
    });

    const userHobbyIds = user?.Hobbies.map((hobby) => hobby.id) || [];
    const userHobbyIdsString = userHobbyIds.join(',');

    // Construct the ORDER BY clause based on sortBy parameter
    let orderByClause = 'ORDER BY distance';

    switch (queryString.sortBy) {
      case TripSorting.DRIVER_RATE:
        orderByClause = 'ORDER BY u.driver_rate DESC';
        break;
      case TripSorting.HIGHEST_PRICE:
        orderByClause = 'ORDER BY bt.price_per_seat DESC';
        break;
      case TripSorting.LOWEST_PRICE:
        orderByClause = 'ORDER BY bt.price_per_seat ASC';
        break;
      case TripSorting.RELEVANCE:
        if (userHobbyIds.length > 0) {
          orderByClause = `
          ORDER BY (
            SELECT COUNT(*)
            FROM "_HobbiesToUser" hu_driver
            JOIN "_HobbiesToUser" hu_user ON hu_driver."A" = hu_user."A"
            WHERE hu_driver."B" = t.driver_id
              AND hu_user."A" IN (${userHobbyIdsString})
          ) DESC
        `;
        } else {
          break;
        }
        break;
      // Default is 'closest' (i.e., sorted by distance)
      default:
        orderByClause = 'ORDER BY distance';
    }
    // TODO Start_Date, Relevance
    return prisma.$queryRaw`
      SELECT 
        t.id, 
        t.start_date, 
        t.end_date, 
        t.driver_id, 
        t.status, 
        t.features,
        u.id as driver_id, 
        u.name as driver_name, 
        u.phone as driver_phone, 
        u.location as driver_location, 
        u.driver_rate as driver_rate,
        u.avatar as driver_avatar,
        bt.seats_no as basic_trip_seats_no, 
        bt.available_seats_no as basic_trip_available_seats_no, 
        bt.price_per_seat as basic_trip_price_per_seat, 
        bt.destination_id as basic_trip_destination_id, 
        bt.pickup_location_id as basic_trip_pickup_location_id,
        v.vehicle_type_id as vehicle_type_id,
        vt.file_path as vehicle_type_image,
        ml_pickup.location as pickupLocation,
        ml_destination.location as destinationLocation,
        ml_pickup.${Prisma.raw(name)} as pickupLocationName,
        ml_destination.${Prisma.raw(name)} as destinationLocationName,
        2 * 6371 * asin(
          sqrt(
            power(sin(radians((CAST(ml_destination.location->>'lat' AS FLOAT) - CAST(${queryString.destinationLat} AS FLOAT)) / 2)), 2) +
            cos(radians(CAST(${queryString.destinationLat} AS FLOAT))) * cos(radians(CAST(ml_destination.location->>'lat' AS FLOAT))) *
            power(sin(radians((CAST(ml_destination.location->>'lng' AS FLOAT) - CAST(${queryString.destinationLng} AS FLOAT)) / 2)), 2)
          )
        ) AS distance
      FROM 
        "Trip" t
      JOIN 
        "Basic_Trip" bt ON t.id = bt.trip_id
      JOIN 
        "User" u ON t.driver_id = u.id
      JOIN 
        "Vehicle" v ON t.vehicle_id = v.id
      JOIN
        "Vehicle_Type" vt ON v.vehicle_type_id = vt.id
      JOIN 
        "Meeting_Location" ml_pickup ON bt.pickup_location_id = ml_pickup.id
      JOIN 
        "Meeting_Location" ml_destination ON bt.destination_id = ml_destination.id
      WHERE
        t.gender = ${gender}
        AND t.type = ${tripType}
        AND t.status = ${tripStatus}
        AND ml_pickup."cityId" = ${cityPickupId}
        AND Date(t.start_date) >= Date(${startDate})
        AND (
          2 * 6371 * asin(
            sqrt(
              power(sin(radians((CAST(ml_destination.location->>'lat' AS FLOAT) - CAST(${queryString.destinationLat} AS FLOAT)) / 2)), 2) +
              cos(radians(CAST(${queryString.destinationLat} AS FLOAT))) * cos(radians(CAST(ml_destination.location->>'lat' AS FLOAT))) *
              power(sin(radians((CAST(ml_destination.location->>'lng' AS FLOAT) - CAST(${queryString.destinationLng} AS FLOAT)) / 2)), 2)
            )
          )
        ) < 10000
      ${Prisma.raw(orderByClause)}
      LIMIT ${limit} OFFSET ${offset};
    `;
  }

  // TODO: MilldeWare to check payment
  // TODO: Apply PromoCode
  async join(
    data: JoinBasicTripType,
    tripPriceBreakdown: TripBillingDetails,
  ): Promise<JoinBasicTrip> {
    const userAppShare = +process.env.USER_APP_SHARE!;
    const userTax = userAppShare * 0.15;
    const driverAppShare =
      (tripPriceBreakdown.price * +process.env.APP_SHARE!) / 100;

    return prisma.$transaction(async (tx) => {
      if (
        tripPriceBreakdown.has_app_share_discount &&
        data.payment_method !== PaymentMethod.APPLEPAY
      ) {
        await tx.user.update({
          where: { id: data.passenger_id },
          data: {
            discount_app_share_count: { decrement: 1 },
          },
        });
      }

      if (
        tripPriceBreakdown.has_debt &&
        data.payment_method === PaymentMethod.CASH
      ) {
        await tx.user.update({
          where: { id: data.passenger_id },
          data: {
            user_wallet_balance: { increment: tripPriceBreakdown.debt },
            Passenger_Wallet_Transaction: {
              create: {
                amount: tripPriceBreakdown.debt,
                current_balance:
                  tripPriceBreakdown.user_wallet_balance +
                  tripPriceBreakdown.debt,
                previous_balance: tripPriceBreakdown.user_wallet_balance,
                transaction_type: TransactionType.DEBT_PAYMENT,
                trip_id: data.trip_id,
              },
            },
          },
        });
      }

      await tx.basic_Trip.update({
        where: { trip_id: data.trip_id },
        data: {
          available_seats_no: { decrement: 1 },
        },
      });

      return tx.passenger_Trip.create({
        data: {
          trip_id: data.trip_id,
          passenger_id: data.passenger_id,
          payment_status:
            data.payment_method === PaymentMethod.APPLEPAY
              ? PaymentStatus.PENDING
              : PaymentStatus.SUCCESS,
          payment_method: data.payment_method,
          app_share_discount: tripPriceBreakdown.has_app_share_discount
            ? userAppShare
            : 0,
          user_app_share: userAppShare,
          user_debt: tripPriceBreakdown.debt,
          user_tax: userTax,
          driver_app_share: driverAppShare,
          discount: tripPriceBreakdown.discount,
          promo_code_id: tripPriceBreakdown.promo_code_id,
          transactionId: data.transactionId,
          status:
            data.payment_method === PaymentMethod.APPLEPAY
              ? PassengerTripStatus.PENDING_PAYMENT
              : undefined,
        },
      });
    });
  }

  async cancelByDriver(
    data: CancelBasicTrip,
  ): Promise<DriverCancelationReturn | undefined> {
    const trip = await this.getTripById(data.trip_id);
    // There is no passengers in the trip so we can hard delete the trip using cascade to delete basic_trip
    if (trip.Basic_Trip!.Passengers.length === 0) {
      await prisma.trip.delete({ where: { id: data.trip_id } });
      return;
    }
    const basicTrip = await prisma.basic_Trip.findUnique({
      where: { trip_id: data.trip_id },
      select: {
        Passengers: {
          where: {
            status: { not: PassengerTripStatus.CANCELLED_BY_PASSENGER },
          },
          select: {
            Passnger: {
              select: {
                uuid: true,
                prefered_language: true,
                User_FCM_Tokens: true,
              },
            },
          },
        },
      },
    });
    const passengers = trip.Basic_Trip!.Passengers.filter(
      (p) => p.status !== PassengerTripStatus.CANCELLED_BY_PASSENGER,
    );
    const isCloseToStart = moment(trip.start_date).isBefore(
      moment().add(30, 'minutes'),
    );
    const havePenalty = passengers && isCloseToStart;

    await prisma.$transaction(async (prismaTransaction) => {
      if (havePenalty) {
        await this.applyDriverPenalty(
          trip.driver_id!,
          data.trip_id,
          prismaTransaction,
        );
      }
      await this.processPassengerRefunds(
        passengers,
        trip.Basic_Trip!.price_per_seat,
        data.trip_id,
        havePenalty,
        prismaTransaction,
      );
      await this.cancelTripAndUpdatePassengerStatus(data, prismaTransaction);
    });
    return {
      type: trip.type,
      users: basicTrip?.Passengers.map((p) => p.Passnger)!,
    };
  }

  async cancelByPassenger(
    data: CancelBasicTrip,
  ): Promise<UserCancelationReturn | undefined> {
    const { trip_id: tripId, user_id: passengerId } = data;
    const trip = await this.getTripById(tripId);
    const foundPassenger = await prisma.passenger_Trip.findUnique({
      where: {
        id: data.passenger_trip_id,
      },
      include: {
        Passnger: true,
      },
    });

    if (!foundPassenger) {
      throw new ApiError('Passenger not found', 404); // he cant cancel this trip cus he dont join
    }

    if (foundPassenger.status === PassengerTripStatus.CANCELLED_BY_PASSENGER) {
      throw new ApiError('You have already cancelled this trip', 400);
    }

    const passengerPaymentMethod = foundPassenger.payment_method;
    const passengerDetails = foundPassenger.Passnger;
    const isCloseToStart = moment(trip.start_date).isBefore(
      moment().add(30, 'minutes'),
    );
    const userWallet = passengerDetails.user_wallet_balance;
    const newWallet = isCloseToStart ? userWallet - 25 : userWallet;

    await prisma.$transaction(async (prismaTransaction) => {
      if (isCloseToStart) {
        await this.applyPassengerPenalty(
          passengerId,
          tripId,
          userWallet,
          prismaTransaction,
        );
        await this.applyDriverCompensation(
          trip.driver_id!,
          tripId,
          prismaTransaction,
        );
      }

      await this.updateAppShareCount(
        foundPassenger,
        passengerDetails,
        prismaTransaction,
      );

      if (passengerPaymentMethod !== PaymentMethod.CASH) {
        const totalPrice =
          trip.Basic_Trip!.price_per_seat! +
          foundPassenger.user_app_share -
          foundPassenger.app_share_discount -
          foundPassenger.discount;

        await this.processPassengerRefund(
          foundPassenger,
          totalPrice,
          newWallet,
          prismaTransaction,
        );
      } else if (
        passengerPaymentMethod === PaymentMethod.CASH &&
        foundPassenger.user_debt > 0
      ) {
        await this.decrementUserWalletByDebt(
          passengerId,
          foundPassenger.user_debt,
          newWallet,
          tripId,
          prismaTransaction,
        );
      }

      await this.cancelPassengerTrip(data, prismaTransaction);
    });
    const driver = await prisma.user.findUnique({
      where: { id: trip.driver_id! },
      select: {
        uuid: true,
        User_FCM_Tokens: true,
        prefered_language: true,
      },
    });
    return {
      type: trip.type,
      user: driver!,
    };
  }

  async endTrip(tripId: number, driverId: number): Promise<EndTrip> {
    // Aggregated financial details
    const financials = {
      totalFarePerSeat: 0,
      totalUserAppShare: 0,
      totalUserDebt: 0,
      totalUserTaxAmount: 0,
      totalCashPaymentDiscount: 0,
      totalCashUserAppShare: 0,
      totalCardPaymentAmount: 0,
    };

    // Fetch trip details and passengers
    const trip = await prisma.trip.findUnique({
      where: {
        id: tripId,
        driver_id: driverId,
      },
      include: {
        Basic_Trip: {
          include: {
            Passengers: {
              where: {
                status: PassengerTripStatus.ARRIVED,
              },
              include: {
                Passnger: true,
              },
            },
          },
        },
      },
    });

    if (trip && trip.status === TripStatus.COMPLETED) {
      throw new ApiError('Trip already ended', 400);
    }

    // Handle invalid trip cases
    if (!trip || !trip.Basic_Trip || trip.Basic_Trip.Passengers.length === 0) {
      throw new ApiError('Trip not found', 404);
    }

    await tripService.validateDriverInLocation(
      tripId,
      trip.status as TripStatus,
    );
    // Fetch driver details
    const driver = await prisma.user.findUnique({ where: { id: driverId } });
    if (!driver) {
      throw new ApiError('Driver not found', 404);
    }

    let driverWallet = driver.driver_wallet_balance;

    // Aggregate financial data
    trip.Basic_Trip.Passengers.forEach((p) => {
      financials.totalFarePerSeat += trip.Basic_Trip!.price_per_seat;
      financials.totalUserAppShare += p.user_app_share - p.app_share_discount;
      financials.totalUserTaxAmount += p.user_tax;
      financials.totalUserDebt += p.user_debt;

      if (p.payment_method === PaymentMethod.CASH) {
        financials.totalCashUserAppShare +=
          p.user_app_share - p.app_share_discount;
        financials.totalCashPaymentDiscount += p.discount;
      } else if (
        p.payment_method === PaymentMethod.CARD ||
        p.payment_method === PaymentMethod.WALLET
      ) {
        financials.totalCardPaymentAmount += trip.Basic_Trip!.price_per_seat;
      }
    });

    // Transaction to update balances and complete trip
    return prisma.$transaction(async (tx) => {
      // Handle card and wallet payments
      if (financials.totalCardPaymentAmount > 0) {
        driverWallet += financials.totalCardPaymentAmount;
        await tx.user.update({
          where: { id: driverId },
          data: {
            driver_wallet_balance: driverWallet,
            Driver_Wallet_Transaction: {
              create: {
                amount: financials.totalCardPaymentAmount,
                current_balance: driverWallet,
                previous_balance:
                  driverWallet - financials.totalCardPaymentAmount,
                transaction_type: TransactionType.COMPLETE_TRIP,
                trip_id: tripId,
              },
            },
          },
        });
      }

      // Handle cash payments
      if (financials.totalCashUserAppShare > 0) {
        driverWallet -= financials.totalCashUserAppShare;
        await tx.user.update({
          where: { id: driverId },
          data: {
            driver_wallet_balance: driverWallet,
            Driver_Wallet_Transaction: {
              create: {
                amount: -financials.totalCashUserAppShare,
                current_balance: driverWallet,
                previous_balance:
                  driverWallet + financials.totalCashUserAppShare,
                transaction_type: TransactionType.USER_APP_SHARE,
                trip_id: tripId,
              },
            },
          },
        });
      }

      if (financials.totalUserDebt > 0) {
        driverWallet -= financials.totalUserDebt;
        await tx.user.update({
          where: { id: driverId },
          data: {
            driver_wallet_balance: driverWallet,
            Driver_Wallet_Transaction: {
              create: {
                amount: -financials.totalUserDebt,
                current_balance: driverWallet,
                previous_balance: driverWallet + financials.totalUserDebt,
                transaction_type: TransactionType.USER_DEBT,
                trip_id: tripId,
              },
            },
          },
        });
      }

      if (financials.totalCashPaymentDiscount > 0) {
        driverWallet += financials.totalCashPaymentDiscount;
        await tx.user.update({
          where: { id: driverId },
          data: {
            driver_wallet_balance: driverWallet,
            Driver_Wallet_Transaction: {
              create: {
                amount: financials.totalCashPaymentDiscount,
                current_balance: driverWallet,
                previous_balance:
                  driverWallet - financials.totalCashPaymentDiscount,
                transaction_type: TransactionType.DISCOUNT_REFUND,
                trip_id: tripId,
              },
            },
          },
        });
      }

      // Calculate and deduct the driver's app share
      const driverAppShare =
        (financials.totalFarePerSeat * +process.env.APP_SHARE!) / 100;
      const driverTax = driverAppShare * 0.15;
      driverWallet -= driverAppShare;

      await tx.user.update({
        where: { id: driverId },
        data: {
          driver_wallet_balance: driverWallet,
          Driver_Wallet_Transaction: {
            create: {
              amount: -driverAppShare,
              current_balance: driverWallet,
              previous_balance: driverWallet + driverAppShare,
              transaction_type: TransactionType.APP_SHARE,
              trip_id: tripId,
            },
          },
        },
      });

      // Mark the trip as completed
      const updatedTrip = await tx.trip.update({
        where: { id: tripId },
        data: {
          status: TripStatus.COMPLETED,
          price: financials.totalFarePerSeat,
          driver_app_share: driverAppShare,
          user_tax: financials.totalUserTaxAmount,
          driver_tax: driverTax,
          user_app_share: financials.totalUserAppShare,
          Basic_Trip: {
            update: {
              Passengers: {
                updateMany: {
                  where: {
                    trip_id: tripId,
                    status: PassengerTripStatus.ARRIVED,
                  },
                  data: {
                    status: PassengerTripStatus.COMPLETED,
                  },
                },
              },
            },
          },
        },
        include: {
          Basic_Trip: {
            select: {
              Passengers: {
                where: {
                  status: {
                    notIn: [
                      PassengerTripStatus.CANCELLED_BY_PASSENGER,
                      PassengerTripStatus.ON_HOLD,
                    ],
                  },
                },
                select: {
                  Passnger: {
                    select: {
                      uuid: true,
                      prefered_language: true,
                      User_FCM_Tokens: true,
                    },
                  },
                },
              },
              Pickup_Location: {
                select: {
                  location: true,
                },
              },
              Destination: {
                select: {
                  location: true,
                },
              },
            },
          },
          Vehicle: {
            select: {
              serial_no: true,
            },
          },
          Driver: {
            select: {
              national_id: true,
            },
          },
        },
      });

      return {
        tripStatusInfo: {
          id: tripId,
          driverId,
          status: updatedTrip.status,
          users: updatedTrip.Basic_Trip?.Passengers.map((p) => p.Passnger)!,
        },
        tripSummary: {
          sequenceNumber: updatedTrip.Vehicle!.serial_no,
          tripId,
          driverId: updatedTrip.Driver!.national_id!,
          startedWhen: updatedTrip.start_date.toISOString(),
          pickupTimestamp: convertDateToKSA(updatedTrip.pickup_time!),
          dropoffTimestamp: convertDateToKSA(updatedTrip.end_date!),
          distanceInMeters: updatedTrip.distance,
          durationInSeconds:
            (updatedTrip.end_date!.getTime() -
              updatedTrip.start_date.getTime()) /
            1000,
          customerRating: 5,
          customerWaitingTimeInSeconds: Math.ceil(
            Math.abs(
              (updatedTrip.start_date.getTime() -
                updatedTrip.pickup_time!.getTime()) /
                1000,
            ),
          ),
          originLatitude: (
            updatedTrip.Basic_Trip!.Pickup_Location.location! as Location
          ).lat,
          originLongitude: (
            updatedTrip.Basic_Trip!.Pickup_Location.location! as Location
          ).lng,
          destinationLatitude: (
            updatedTrip.Basic_Trip!.Destination.location! as Location
          ).lat,
          destinationLongitude: (
            updatedTrip.Basic_Trip!.Destination.location! as Location
          ).lng,
          tripCost: updatedTrip.price,
        },
      };
    });
  }

  async calculateTripPrice(data: CalculateTripPrice): Promise<TripPrice> {
    const trip = await prisma.basic_Trip.findUnique({
      where: { trip_id: data.trip_id },
    });
    if (!trip) throw new ApiError('Trip not found', 404);

    const passenger = await prisma.user.findUnique({
      where: { id: data.passenger_id },
      select: {
        discount_app_share_count: true,
        user_wallet_balance: true,
      },
    });
    if (!passenger) throw new ApiError('Passenger not found', 404);

    const userAppShare = +process.env.USER_APP_SHARE!;
    const price = trip.price_per_seat;
    const userDebt =
      passenger.user_wallet_balance < 0
        ? passenger.user_wallet_balance * -1
        : 0;
    const appShareDiscount =
      passenger.discount_app_share_count > 0 ? userAppShare : 0;
    const app_share = userAppShare - appShareDiscount;

    let discount = 0;
    if (data.coupon) {
      const promoCode = await promoCodeService.applyPromoCode(
        data.coupon!,
        data.passenger_id,
        trip.price_per_seat,
      );
      discount = promoCode.discount;
    }

    const totalPrice =
      price + userDebt + userAppShare - appShareDiscount - discount;

    const tripPrice: TripPrice = {
      price,
      app_share,
      debt: userDebt,
      discount,
      total_price: totalPrice,
    };
    return tripPrice;
  }

  private async applyPassengerPenalty(
    passengerId: number,
    tripId: number,
    userWallet: number,
    prisma: Prisma.TransactionClient,
  ): Promise<void> {
    await prisma.user.update({
      where: { id: passengerId },
      data: {
        user_wallet_balance: { decrement: 25 },
        Passenger_Wallet_Transaction: {
          create: {
            amount: -25,
            current_balance: userWallet - 25,
            previous_balance: userWallet,
            transaction_type: TransactionType.CANCELATION_PENALTY,
            trip_id: tripId,
          },
        },
      },
    });
  }

  async getTripById(id: number) {
    const trip = await prisma.trip.findUnique({
      where: {
        id,
      },
      include: {
        Basic_Trip: {
          select: {
            price_per_seat: true,
            Passengers: {
              include: {
                Passnger: true,
              },
            },
          },
        },
      },
    });
    if (!trip || !trip.Basic_Trip) {
      throw new ApiError('Trip not found', 404);
    }

    if (
      trip.status === TripStatus.CANCELLED ||
      trip.status === TripStatus.COMPLETED ||
      trip.status === TripStatus.INPROGRESS
    )
      throw new ApiError(`You can't cancel ${trip.status} trip`, 400);
    return trip;
  }

  private async applyDriverCompensation(
    driverId: number,
    tripId: number,
    prisma: Prisma.TransactionClient,
  ): Promise<void> {
    const driver = await prisma.user.findUnique({ where: { id: driverId } });
    if (!driver) {
      throw new ApiError('Driver not found', 404);
    }
    const driverWallet = driver.driver_wallet_balance;

    await prisma.user.update({
      where: { id: driverId },
      data: {
        driver_wallet_balance: { increment: 25 },
        Driver_Wallet_Transaction: {
          create: {
            amount: 25,
            current_balance: driverWallet + 25,
            previous_balance: driverWallet,
            transaction_type: TransactionType.CANCELATION_COMPENSATION,
            trip_id: tripId,
          },
        },
      },
    });
  }

  private async updateAppShareCount(
    foundPassenger: JoinBasicTrip,
    passengerDetails: UpdateUser,
    prisma: Prisma.TransactionClient,
  ): Promise<void> {
    const discountShare = foundPassenger.app_share_discount;
    const updatedDiscountShareCount =
      discountShare === 0
        ? passengerDetails.discount_app_share_count
        : passengerDetails.discount_app_share_count! + 1;

    await prisma.user.update({
      where: { id: foundPassenger.passenger_id },
      data: {
        discount_app_share_count: updatedDiscountShareCount,
        passenger_cancel_count: { increment: 1 },
      },
    });
  }

  private async processPassengerRefund(
    foundPassenger: JoinBasicTrip,
    price: number,
    newWallet: number,
    prisma: Prisma.TransactionClient,
  ): Promise<void> {
    await prisma.user.update({
      where: { id: foundPassenger.passenger_id },
      data: {
        user_wallet_balance: { increment: price },
        Passenger_Wallet_Transaction: {
          create: {
            amount: price,
            transaction_type: TransactionType.CANCELATION_REFUND,
            previous_balance: newWallet,
            current_balance: newWallet + price,
            trip_id: foundPassenger.trip_id,
          },
        },
      },
    });
  }

  private async cancelPassengerTrip(
    data: CancelBasicTrip,
    prisma: Prisma.TransactionClient,
  ): Promise<void> {
    const { trip_id, user_id, passenger_trip_id } = data;
    await prisma.passenger_Trip.update({
      where: {
        id: passenger_trip_id,
      },
      data: {
        status: PassengerTripStatus.CANCELLED_BY_PASSENGER,
        Basic_Trip: {
          update: {
            available_seats_no: { increment: 1 },
          },
        },
        Passenger_Trip_Cancellation: {
          create: {
            trip_id,
            passenger_id: user_id,
            reason: data.reason,
            note: data.note,
          },
        },
      },
    });
  }

  private async processPassengerRefunds(
    passengers: JoinBasicTrip[],
    pricePerSeat: number,
    tripId: number,
    havePenalty: boolean,
    prisma: Prisma.TransactionClient,
  ): Promise<void> {
    await Promise.all(
      passengers.map(async (p) => {
        const passenger = await prisma.user.findUnique({
          where: { id: p.passenger_id },
        });

        if (!passenger) {
          return;
        }

        const discountShare = p.app_share_discount;
        const totalPrice =
          pricePerSeat + p.user_app_share - discountShare - p.discount;

        const penaltyCount = havePenalty ? 1 : 0;
        const baseCount = discountShare === 0 ? 0 : 1;

        const updatedDiscountShareCount =
          passenger.discount_app_share_count + baseCount + penaltyCount;

        await prisma.user.update({
          where: { id: p.passenger_id },
          data: {
            discount_app_share_count: updatedDiscountShareCount,
          },
        });

        if (p.payment_method !== PaymentMethod.CASH) {
          await prisma.user.update({
            where: { id: p.passenger_id },
            data: {
              user_wallet_balance: { increment: totalPrice },
              Passenger_Wallet_Transaction: {
                create: {
                  amount: totalPrice,
                  current_balance: passenger!.user_wallet_balance + totalPrice,
                  previous_balance: passenger!.user_wallet_balance,
                  transaction_type: TransactionType.CANCELATION_REFUND,
                  trip_id: tripId,
                },
              },
            },
          });
        } else if (p.payment_method === PaymentMethod.CASH && p.user_debt > 0) {
          await this.decrementUserWalletByDebt(
            passenger.id,
            p.user_debt,
            passenger.user_wallet_balance,
            tripId,
            prisma,
          );
        }
      }),
    );
  }

  private async applyDriverPenalty(
    driverId: number,
    tripId: number,
    prisma: Prisma.TransactionClient,
  ) {
    const driver = await prisma.user.findUnique({
      where: { id: driverId },
      select: { driver_wallet_balance: true },
    });
    if (!driver) {
      throw new ApiError('Driver not found', 404);
    }

    const driverWallet = driver.driver_wallet_balance;

    await prisma.user.update({
      where: { id: driverId },
      data: {
        driver_wallet_balance: { decrement: 25 },
        Driver_Wallet_Transaction: {
          create: {
            amount: -25,
            current_balance: driverWallet - 25,
            previous_balance: driverWallet,
            transaction_type: TransactionType.CANCELATION_PENALTY,
            trip_id: tripId,
          },
        },
      },
    });
  }

  private async cancelTripAndUpdatePassengerStatus(
    data: CancelBasicTrip,
    prisma: Prisma.TransactionClient,
  ): Promise<void> {
    await prisma.trip.update({
      where: { id: data.trip_id },
      data: {
        status: TripStatus.CANCELLED,
        Driver: {
          update: {
            driver_cancel_count: { increment: 1 },
          },
        },
        Basic_Trip: {
          update: {
            Passengers: {
              updateMany: {
                where: { trip_id: data.trip_id },
                data: {
                  status: PassengerTripStatus.CANCELLED_BY_DRIVER,
                },
              },
            },
            Basic_Trip_Cancellation: {
              create: {
                driver_id: data.user_id,
                reason: data.reason,
                note: data.note,
              },
            },
          },
        },
      },
    });
  }

  private async verifyDestinationAndPickupLocationsExist(
    destinationId: number,
    pickup_locationId: number,
  ): Promise<void> {
    await meetingLocationService.getOne(destinationId);
    await meetingLocationService.getOne(pickup_locationId);
  }

  async checkWalletValidity(
    amount: number,
    userId: number,
    trip_id: number,
    tx: Prisma.TransactionClient,
  ): Promise<void> {
    const user = await tx.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        user_wallet_balance: true,
      },
    });
    if (!user) throw new ApiError('User not found', 404);
    if (user.user_wallet_balance < amount)
      throw new ApiError('Insufficient balance', 400);
    else {
      await tx.user.update({
        where: {
          id: userId,
        },
        data: {
          user_wallet_balance: {
            decrement: amount,
          },
          Passenger_Wallet_Transaction: {
            create: {
              amount,
              current_balance: user!.user_wallet_balance! - amount,
              previous_balance: user!.user_wallet_balance!,
              transaction_type: TransactionType.BOOK_TRIP,
              trip_id,
            },
          },
        },
      });
    }
  }

  async findBasicTripById(id: number) {
    const basicTrip = await prisma.basic_Trip.findUnique({
      where: { trip_id: id },
      select: {
        price_per_seat: true,
      },
    });
    if (!basicTrip) throw new ApiError('Trip not found', 404);
    return basicTrip;
  }

  private async decrementUserWalletByDebt(
    passengerId: number,
    userDebt: number,
    passengerWallet: number,
    tripId: number,
    tx: Prisma.TransactionClient,
  ) {
    await tx.user.update({
      where: { id: passengerId },
      data: {
        user_wallet_balance: { decrement: userDebt },
        Passenger_Wallet_Transaction: {
          create: {
            amount: -userDebt,
            current_balance: passengerWallet - userDebt,
            previous_balance: passengerWallet,
            transaction_type: TransactionType.DEBT_UNPAID,
            trip_id: tripId,
          },
        },
      },
    });
  }

  async markPassengerAsArrived(passengerTripId: number) {
    const seat = await prisma.passenger_Trip.findUnique({
      where: {
        id: passengerTripId,
        status: PassengerTripStatus.JOINED,
      },
    });
    if (!seat) throw new ApiError('Seat not found', 404);
    await prisma.passenger_Trip.update({
      where: {
        id: passengerTripId,
      },
      data: {
        status: PassengerTripStatus.ARRIVED,
      },
    });
  }
}

const basicTripService = new BasicTripService();
export default basicTripService;
