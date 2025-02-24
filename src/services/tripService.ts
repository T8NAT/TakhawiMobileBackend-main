import prisma from '../../prisma/client';
import { Roles } from '../enum/roles';
import {
  OfferStatus,
  PassengerTripStatus,
  TripStatus,
  TripType,
} from '../enum/trip';
import { ITripService } from '../interfaces/tripService';
import { TripBillingDetails } from '../types/basicTripType';
import { PaginateType } from '../types/paginateType';
import {
  TripQueryType,
  Trip,
  VipTripQueryType,
  CalculateTripPrice,
  TripStatusChangeReturn,
} from '../types/tripType';
import { Location } from '../types/userType';
import ApiError from '../utils/ApiError';
import { getDistance } from '../utils/getDistance';
import { paginate } from '../utils/pagination';
import promoCodeService from './promoCodeService';

class TripService implements ITripService {
  async getCompletedTrips(
    userId: number,
    query: TripQueryType,
    role: string,
  ): Promise<PaginateType<Trip>> {
    return paginate(
      'trip',
      {
        where:
          role === Roles.DRIVER
            ? {
                status: TripStatus.COMPLETED,
                driver_id: userId,
                type: query.type,
              }
            : {
                OR: [
                  {
                    Basic_Trip: {
                      Passengers: {
                        some: {
                          passenger_id: userId,
                          status: PassengerTripStatus.COMPLETED,
                        },
                      },
                    },
                  },
                  {
                    VIP_Trip: {
                      passnger_id: userId,
                    },
                  },
                ],
                start_date: {
                  lte: new Date(),
                },
                status: TripStatus.COMPLETED,
                type: query.type,
              },
        select: {
          id: true,
          start_date: true,
          status: true,
          type: true,
          price: true,
          Basic_Trip: {
            select: {
              Pickup_Location: true,
              Destination: true,
              Passengers:
                role === Roles.DRIVER
                  ? {
                      select: {
                        id: true,
                        status: true,
                        Passnger: {
                          select: {
                            id: true,
                            name: true,
                            avatar: true,
                            passenger_rate: true,
                          },
                        },
                      },
                      where: {
                        status: PassengerTripStatus.COMPLETED,
                      },
                    }
                  : {
                      select: {
                        id: true,
                      },
                      where: {
                        passenger_id: userId,
                      },
                    },
            },
          },
          VIP_Trip: {
            select: {
              pickup_location_lat: true,
              pickup_location_lng: true,
              destination_location_lat: true,
              destination_location_lng: true,
              pickup_description: true,
              destination_description: true,
              Passnger:
                role === Roles.DRIVER
                  ? {
                      select: {
                        id: true,
                        name: true,
                        avatar: true,
                        passenger_rate: true,
                      },
                    }
                  : undefined,
            },
          },
          Driver:
            role !== Roles.DRIVER
              ? {
                  select: {
                    id: true,
                    name: true,
                    avatar: true,
                    driver_rate: true,
                  },
                }
              : undefined,
        },
        orderBy: {
          start_date: 'desc',
        },
      },
      query.page,
      query.limit,
    );
  }

  async getCancelledTrips(
    userId: number,
    query: TripQueryType,
    role: string,
  ): Promise<PaginateType<Trip>> {
    return paginate(
      'trip',
      {
        where:
          role === Roles.DRIVER
            ? {
                status: TripStatus.CANCELLED,
                driver_id: userId,
                type: query.type,
              }
            : {
                OR: [
                  {
                    Basic_Trip: {
                      Passengers: {
                        every: {
                          OR: [
                            {
                              passenger_id: userId,
                              status:
                                PassengerTripStatus.CANCELLED_BY_PASSENGER,
                            },
                            {
                              passenger_id: {
                                not: userId,
                              },
                            },
                          ],
                        },
                        some: {
                          passenger_id: userId,
                        },
                      },
                    },
                  },
                  {
                    VIP_Trip: {
                      passnger_id: userId,
                    },
                    status: TripStatus.CANCELLED,
                  },
                  {
                    Basic_Trip: {
                      Passengers: {
                        some: {
                          passenger_id: userId,
                        },
                      },
                    },
                    status: TripStatus.CANCELLED,
                  },
                ],
                type: query.type,
              },
        select: {
          id: true,
          start_date: true,
          status: true,
          type: true,
          Basic_Trip: {
            select: {
              Pickup_Location: true,
              Destination: true,
              Passengers:
                role === Roles.DRIVER
                  ? {
                      select: {
                        id: true,
                        status: true,
                        Passnger: {
                          select: {
                            id: true,
                            name: true,
                            avatar: true,
                            passenger_rate: true,
                          },
                        },
                      },
                    }
                  : {
                      select: {
                        id: true,
                      },
                      where: {
                        passenger_id: userId,
                      },
                    },
            },
          },
          VIP_Trip: {
            select: {
              pickup_location_lat: true,
              pickup_location_lng: true,
              destination_location_lat: true,
              destination_location_lng: true,
              pickup_description: true,
              destination_description: true,
              Passnger:
                role === Roles.DRIVER
                  ? {
                      select: {
                        id: true,
                        name: true,
                        avatar: true,
                        passenger_rate: true,
                      },
                    }
                  : undefined,
            },
          },
          Driver:
            role !== Roles.DRIVER
              ? {
                  select: {
                    id: true,
                    name: true,
                    avatar: true,
                    driver_rate: true,
                  },
                }
              : undefined,
        },
        orderBy: {
          start_date: 'desc',
        },
      },
      query.page,
      query.limit,
    );
  }

  async getUpcomingTrips(
    userId: number,
    query: TripQueryType,
    role: string,
  ): Promise<PaginateType<Trip>> {
    return paginate(
      'trip',
      {
        where:
          role === Roles.DRIVER
            ? {
                start_date: {
                  gte: new Date(),
                },
                status: { notIn: [TripStatus.CANCELLED, TripStatus.COMPLETED] },
                driver_id: userId,
                type: query.type,
              }
            : {
                OR: [
                  {
                    Basic_Trip: {
                      Passengers: {
                        some: {
                          passenger_id: userId,
                          status: {
                            notIn: [
                              PassengerTripStatus.CANCELLED_BY_PASSENGER,
                              PassengerTripStatus.COMPLETED,
                            ],
                          },
                        },
                      },
                    },
                  },
                  {
                    VIP_Trip: {
                      passnger_id: userId,
                    },
                  },
                ],
                start_date: {
                  gte: new Date(),
                },
                status: { notIn: [TripStatus.CANCELLED, TripStatus.COMPLETED] },
                type: query.type,
              },
        select: {
          id: true,
          start_date: true,
          status: true,
          type: true,
          Basic_Trip: {
            select: {
              Pickup_Location: true,
              Destination: true,
              Passengers:
                role === Roles.DRIVER
                  ? {
                      select: {
                        id: true,
                        status: true,
                        payment_method: true,
                        Passnger: {
                          select: {
                            id: true,
                            name: true,
                            avatar: true,
                            passenger_rate: true,
                          },
                        },
                      },
                      where: {
                        status: {
                          not: PassengerTripStatus.CANCELLED_BY_PASSENGER,
                        },
                      },
                    }
                  : {
                      select: {
                        id: true,
                      },
                      where: {
                        passenger_id: userId,
                      },
                    },
            },
          },
          VIP_Trip: {
            select: {
              pickup_location_lat: true,
              pickup_location_lng: true,
              destination_location_lat: true,
              destination_location_lng: true,
              pickup_description: true,
              destination_description: true,
              payment_method: true,
              Passnger:
                role === Roles.DRIVER
                  ? {
                      select: {
                        id: true,
                        name: true,
                        avatar: true,
                        passenger_rate: true,
                      },
                    }
                  : undefined,
            },
          },
          Driver:
            role !== Roles.DRIVER
              ? {
                  select: {
                    id: true,
                    name: true,
                    avatar: true,
                    driver_rate: true,
                  },
                }
              : undefined,
        },
        orderBy: {
          start_date: 'asc',
        },
      },
      query.page,
      query.limit,
    );
  }

  async getTrips(query: TripQueryType): Promise<PaginateType<Trip>> {
    return paginate(
      'trip',
      {
        where: {
          type: query.type,
          status: query.status,
          start_date: {
            lte: query.to,
            gte: query.from,
          },
        },
        select: {
          id: true,
          start_date: true,
          status: true,
          type: true,
          Basic_Trip: {
            select: {
              Pickup_Location: true,
              Destination: true,
              Passengers: true,
            },
          },
          VIP_Trip: {
            select: {
              pickup_location_lat: true,
              pickup_location_lng: true,
              destination_location_lat: true,
              destination_location_lng: true,
              pickup_description: true,
              destination_description: true,
              passnger_id: true,
            },
          },
          Driver: {
            select: {
              id: true,
              name: true,
              avatar: true,
              driver_rate: true,
            },
          },
        },
        orderBy: {
          start_date: 'asc',
        },
      },
      query.page,
      query.limit,
    );
  }

  async updateTripStatus(
    tripId: number,
    status: string,
    driverId: number,
  ): Promise<TripStatusChangeReturn> {
    await this.tripCheck(tripId, driverId);
    await this.validateDriverInLocation(tripId, status as TripStatus);
    const trip = await prisma.trip.update({
      where: {
        id: tripId,
      },
      data: {
        status,
        pickup_time: status === TripStatus.INPROGRESS ? new Date() : null,
      },
      select: {
        status: true,
        type: true,
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
          },
        },
        VIP_Trip: {
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
    if (trip.type === TripType.VIPTRIP) {
      return {
        id: tripId,
        status: trip.status,
        driverId,
        users: [
          {
            uuid: trip.VIP_Trip?.Passnger.uuid!,
            User_FCM_Tokens: trip.VIP_Trip?.Passnger.User_FCM_Tokens!,
            prefered_language: trip.VIP_Trip?.Passnger.prefered_language!,
          },
        ],
      };
    }
    return {
      id: tripId,
      status: trip.status,
      driverId,
      users: trip.Basic_Trip?.Passengers.map((p) => p.Passnger)!,
    };
  }

  async tripCheck(tripId: number, driverId: number): Promise<Trip> {
    const trip = await prisma.trip.findUnique({
      where: {
        id: tripId,
        driver_id: driverId,
      },
    });
    if (!trip) {
      throw new ApiError('Trip not found', 404);
    }
    return trip;
  }

  async getActiveTrip(userId: number, role: string): Promise<any> {
    // TODO: Change Search Criteria After Mark's Confirmation
    return prisma.trip.findFirst({
      where:
        role === Roles.USER
          ? {
              OR: [
                {
                  VIP_Trip: {
                    passnger_id: userId,
                  },
                },
                {
                  Basic_Trip: {
                    Passengers: {
                      some: {
                        passenger_id: userId,
                        status: {
                          in: [
                            PassengerTripStatus.JOINED,
                            PassengerTripStatus.ON_HOLD,
                          ],
                        },
                      },
                    },
                  },
                },
              ],
              status: TripStatus.ON_WAY,
            }
          : {
              driver_id: userId,
              status: TripStatus.ON_WAY,
            },
      select: {
        id: true,
        start_date: true,
        status: true,
        type: true,
        Driver:
          role === Roles.USER
            ? {
                select: {
                  id: true,
                  name: true,
                  driver_rate: true,
                  avatar: true,
                  phone: true,
                },
              }
            : undefined,
        Vehicle:
          role === Roles.USER
            ? {
                select: {
                  id: true,
                  plate_alphabet: true,
                  plate_alphabet_ar: true,
                  plate_number: true,
                  Vehicle_Type: {
                    select: {
                      ar_name: true,
                      en_name: true,
                      file_path: true,
                    },
                  },
                  Vehicle_Class: {
                    select: {
                      ar_name: true,
                      en_name: true,
                    },
                  },
                  Vehicle_Color: {
                    select: {
                      ar_name: true,
                      en_name: true,
                    },
                  },
                  Vehicle_Name: {
                    select: {
                      ar_name: true,
                      en_name: true,
                    },
                  },
                },
              }
            : undefined,
        Basic_Trip: {
          select: {
            Pickup_Location: true,
            Destination: true,
            Passengers:
              role === Roles.DRIVER
                ? {
                    select: {
                      id: true,
                      status: true,
                      Passnger: {
                        select: {
                          id: true,
                          name: true,
                          avatar: true,
                          phone: true,
                          passenger_rate: true,
                        },
                      },
                    },
                  }
                : {
                    select: {
                      id: true,
                    },
                    where: {
                      passenger_id: userId,
                    },
                  },
          },
        },
        VIP_Trip: {
          select: {
            pickup_location_lat: true,
            pickup_location_lng: true,
            destination_location_lat: true,
            destination_location_lng: true,
            pickup_description: true,
            destination_description: true,
            payment_method: true,
            Passnger: {
              select: {
                id: true,
                name: true,
                avatar: true,
                phone: true,
              },
            },
          },
        },
      },
    });
  }

  async getNearByVipTrips(query: VipTripQueryType): Promise<any> {
    const { lat, lng, gender, distance } = query;
    const d = distance ? Math.ceil(+distance) : 30;
    const trips = await prisma.$queryRaw`
      SELECT 
        subquery.*,
        (
          SELECT COUNT(*)::int
          FROM (
            -- Count completed trips for the passenger in basic trips
            SELECT pt.id
            FROM "Passenger_Trip" pt
            JOIN "Basic_Trip" bt ON pt.trip_id = bt.trip_id
            WHERE pt.status = ${PassengerTripStatus.COMPLETED}
              AND pt.passenger_id = subquery.passenger_id
            UNION ALL
            -- Count completed trips for the passenger in VIP trips
            SELECT vt.trip_id
            FROM "VIP_Trip" vt
            JOIN "Trip" t ON vt.trip_id = t.id
            WHERE vt.passnger_id = subquery.passenger_id
              AND t.status = ${TripStatus.COMPLETED}
          ) AS completed_trips
        ) AS passenger_completed_trips
      FROM (
        SELECT 
          t.id,
          t.status,
          t.start_date,
          t.features,
          u.id AS passenger_id, 
          u.phone AS passenger_phone, 
          u.name AS passenger_name, 
          u.avatar AS passenger_avatar,
          u.passenger_rate,
          v.pickup_location_lat, 
          v.pickup_location_lng,
          v.pickup_description,
          v.destination_location_lat, 
          v.destination_location_lng,
          v.destination_description,
          2 * 6371 * asin(
            sqrt(
              (sin(radians((v.pickup_location_lat - ${+lat!}) / 2))) ^ 2 +
              cos(radians(${+lat!})) * cos(radians(v.pickup_location_lat)) *
              (sin(radians((v.pickup_location_lng - ${+lng!}) / 2))) ^ 2
            )
          ) as distance
        FROM "Trip" t
        JOIN "VIP_Trip" v ON t.id = v.trip_id
        JOIN "User" u ON v.passnger_id = u.id
        WHERE t.gender = ${gender}
          AND t.type = ${TripType.VIPTRIP}
          AND t.status = ${TripStatus.PENDING}
          AND t."deletedAt" IS NULL
      ) AS subquery
      WHERE distance < ${d}
      ORDER BY distance
    `;
    return trips;
  }

  async getOne(tripId: number, userId: number, role: string): Promise<any> {
    const trip = await prisma.trip.findFirst({
      where: {
        id: tripId,
      },
      select: {
        id: true,
        start_date: true,
        status: true,
        type: true,
        price: true,
        Driver:
          role === Roles.USER
            ? {
                select: {
                  id: true,
                  name: true,
                  driver_rate: true,
                  avatar: true,
                  phone: true,
                },
              }
            : undefined,
        Vehicle:
          role === Roles.USER
            ? {
                select: {
                  id: true,
                  plate_alphabet: true,
                  plate_alphabet_ar: true,
                  plate_number: true,
                  Vehicle_Type: {
                    select: {
                      ar_name: true,
                      en_name: true,
                      file_path: true,
                    },
                  },
                  Vehicle_Class: {
                    select: {
                      ar_name: true,
                      en_name: true,
                    },
                  },
                  Vehicle_Color: {
                    select: {
                      ar_name: true,
                      en_name: true,
                    },
                  },
                  Vehicle_Name: {
                    select: {
                      ar_name: true,
                      en_name: true,
                    },
                  },
                },
              }
            : undefined,
        Basic_Trip: {
          select: {
            Pickup_Location: true,
            Destination: true,
            price_per_seat: true,
            Passengers:
              role === Roles.DRIVER
                ? {
                    select: {
                      id: true,
                      status: true,
                      Passnger: {
                        select: {
                          id: true,
                          name: true,
                          avatar: true,
                          phone: true,
                          passenger_rate: true,
                        },
                      },
                    },
                  }
                : {
                    select: {
                      id: true,
                      user_debt: true,
                      user_app_share: true,
                      discount: true,
                      app_share_discount: true,
                    },
                    where: {
                      passenger_id: userId,
                    },
                  },
          },
        },
        VIP_Trip: {
          select: {
            pickup_location_lat: true,
            pickup_location_lng: true,
            destination_location_lat: true,
            destination_location_lng: true,
            pickup_description: true,
            destination_description: true,
            payment_method: true,
            app_share_discount: true,
            discount: true,
            user_app_share: true,
            user_debt: true,
            Passnger: {
              select: {
                id: true,
                name: true,
                avatar: true,
                phone: true,
              },
            },
          },
        },
      },
    });
    if (!trip) throw new ApiError('Trip not found', 404);
    return trip;
  }

  async calculateTripPrice(
    data: CalculateTripPrice,
  ): Promise<TripBillingDetails> {
    let price = 0;
    let appShare = 0;
    let discount = 0;
    let userDebt = 0;
    let promo_code_id;

    const passenger = await prisma.user.findUnique({
      where: { id: data.passenger_id },
      select: {
        id: true,
        discount_app_share_count: true,
        user_wallet_balance: true,
      },
    });
    if (!passenger) throw new ApiError('Passenger not found', 404);

    // Determine if the calculation is for a basic trip or a VIP trip
    if (data.type === TripType.BASICTRIP) {
      const trip = await prisma.basic_Trip.findUnique({
        where: { trip_id: data.id },
      });
      if (!trip) throw new ApiError('Trip not found', 404);
      const userAppShare = +process.env.USER_APP_SHARE!;
      const appShareDiscount =
        passenger.discount_app_share_count > 0 ? userAppShare : 0;

      appShare = userAppShare - appShareDiscount;
      price = trip.price_per_seat;
    } else {
      // VIP Trip
      const offer = await prisma.offers.findUnique({
        where: {
          id: data.id,
          Trip: { passnger_id: data.passenger_id },
          status: { in: [OfferStatus.PENDING, OfferStatus.PENDING_PAYMENT] },
        },
      });
      if (!offer) throw new ApiError('Offer not found', 404);

      appShare = offer.user_app_share - offer.app_share_discount;
      price = offer.price;
    }

    // Calculate user debt based on negative wallet balance
    userDebt =
      passenger.user_wallet_balance < 0
        ? passenger.user_wallet_balance * -1
        : 0;

    // Apply promo code if provided
    if (data.coupon) {
      const promoCode = await promoCodeService.applyPromoCode(
        data.coupon,
        passenger.id,
        price,
      );
      discount = promoCode.discount;
      promo_code_id = promoCode.promoCodeId;
    }

    const totalPrice = price + userDebt + appShare - discount;

    const has_app_share_discount = passenger.discount_app_share_count > 0;
    const has_debt = userDebt > 0;

    return {
      price,
      app_share: appShare,
      debt: userDebt,
      discount,
      total_price: totalPrice,
      has_app_share_discount,
      has_debt,
      user_wallet_balance: passenger.user_wallet_balance,
      promo_code_id,
    };
  }

  async validateDriverInLocation(
    tripId: number,
    status: TripStatus,
  ): Promise<void> {
    if (status === TripStatus.ARRIVED || status === TripStatus.COMPLETED) {
      const trip = await prisma.trip.findUnique({
        where: { id: tripId },
        select: {
          Driver: {
            select: {
              location: true,
            },
          },
          VIP_Trip: {
            select: {
              pickup_location_lat: true,
              pickup_location_lng: true,
            },
          },
          Basic_Trip: {
            select: {
              Pickup_Location: {
                select: {
                  location: true,
                },
              },
            },
          },
        },
      });

      const start = {
        latitude:
          trip?.VIP_Trip?.pickup_location_lat ??
          (trip?.Basic_Trip?.Pickup_Location?.location as Location)?.lat,
        longitude:
          trip?.VIP_Trip?.pickup_location_lng ??
          (trip?.Basic_Trip?.Pickup_Location?.location as Location)?.lng,
      };

      const end = {
        latitude: (trip?.Driver?.location as Location)?.lat,
        longitude: (trip?.Driver?.location as Location)?.lng,
      };

      const distance = getDistance(start, end, 'km');

      if (distance > 1) {
        const locationType =
          status === TripStatus.ARRIVED ? 'pickup' : 'destination';
        throw new ApiError(`You are not in the ${locationType} location`, 400);
      }
    }
  }
}

const tripService = new TripService();
export default tripService;
