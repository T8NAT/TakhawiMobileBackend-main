"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VipTripService = void 0;
const moment_1 = __importDefault(require("moment"));
const client_1 = __importDefault(require("../../prisma/client"));
const payment_1 = require("../enum/payment");
const trip_1 = require("../enum/trip");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const wallet_1 = require("../enum/wallet");
const pagination_1 = require("../utils/pagination");
const recentAddressService_1 = __importDefault(require("./recentAddressService"));
const tripService_1 = __importDefault(require("./tripService"));
const convertDateToKSA_1 = require("../types/convertDateToKSA");
class VipTripService {
    async create(data) {
        return client_1.default.trip.create({
            data: {
                start_date: data.start_date,
                status: trip_1.TripStatus.PENDING,
                gender: data.gender,
                type: trip_1.TripType.VIPTRIP,
                distance: data.distance,
                features: {
                    set: data.features,
                },
                VIP_Trip: {
                    create: {
                        pickup_location_lat: data.pickup_location_lat,
                        pickup_location_lng: data.pickup_location_lng,
                        pickup_description: data.pickup_description,
                        destination_location_lat: data.destination_location_lat,
                        destination_location_lng: data.destination_location_lng,
                        destination_description: data.destination_description,
                        passnger_id: data.passnger_id,
                    },
                },
            },
            include: {
                VIP_Trip: {
                    include: {
                        Passnger: true,
                    },
                },
            },
        });
        // TODO: Send notification to driver
    }
    async cancel(trip_id, userId, data) {
        const trip = await client_1.default.vIP_Trip.findUnique({
            where: {
                trip_id,
                passnger_id: userId,
            },
            include: {
                Trip: {
                    select: {
                        status: true,
                        driver_id: true,
                        price: true,
                        start_date: true,
                        type: true,
                    },
                },
            },
        });
        if (!trip)
            throw new ApiError_1.default('Trip not found', 404);
        if (trip.Trip.status === trip_1.TripStatus.CANCELLED
            || trip.Trip.status === trip_1.TripStatus.COMPLETED
            || trip.Trip.status === trip_1.TripStatus.INPROGRESS)
            throw new ApiError_1.default(`You can't cancel ${trip.Trip.status} trip`, 400);
        if (trip.Trip.driver_id) {
            const { userWallet, driverWallet } = await this.getWalletsValues(userId, trip.Trip.driver_id);
            await client_1.default.$transaction(async (tx) => {
                const havePenalty = !(0, moment_1.default)()
                    .add(30, 'minutes')
                    .isBefore(trip.Trip.start_date); // Check if the trip is within the penalty time (!) return reverse of the condition
                await this.cancelTrip(trip_id, userId, trip.Trip.driver_id, data, trip_1.CanceledBy.PASSENGER, tx);
                if (trip.payment_method === payment_1.PaymentMethod.CASH && trip.user_debt > 0) {
                    // Withdraw the user debt from the wallet that got deposited before in the accept offer
                    await tx.user.update({
                        where: {
                            id: userId,
                        },
                        data: {
                            user_wallet_balance: {
                                decrement: trip.user_debt,
                            },
                            Passenger_Wallet_Transaction: {
                                create: {
                                    amount: -trip.user_debt,
                                    transaction_type: wallet_1.TransactionType.DEBT_UNPAID,
                                    previous_balance: userWallet,
                                    current_balance: userWallet - trip.user_debt,
                                    trip_id,
                                },
                            },
                        },
                    });
                }
                if (havePenalty) {
                    await this.userPenalty(userId, trip.Trip.driver_id, trip_id, userWallet - trip.user_debt, driverWallet, tx);
                }
                if (trip.app_share_discount > 0) {
                    await this.increamentUserAppShareCount(userId, tx);
                }
                if (trip.payment_method === payment_1.PaymentMethod.WALLET
                    || trip.payment_method === payment_1.PaymentMethod.CARD) {
                    const newWallet = havePenalty ? userWallet - 25 : userWallet;
                    await this.refundUserWallet(userId, trip.Trip.price
                        + trip.user_app_share
                        - trip.app_share_discount
                        - trip.discount, newWallet, trip_id, tx);
                }
            });
            const driver = await client_1.default.user.findUnique({
                where: {
                    id: trip.Trip.driver_id,
                },
                select: {
                    uuid: true,
                    User_FCM_Tokens: true,
                    prefered_language: true,
                },
            });
            return {
                type: trip.Trip.type,
                user: driver,
            };
        }
        await client_1.default.trip.delete({
            where: {
                id: trip_id,
            },
            include: {
                VIP_Trip: true,
            },
        });
    }
    async driverCancelation(trip_id, driver_id, data) {
        const trip = await client_1.default.vIP_Trip.findUnique({
            where: {
                trip_id,
                Trip: {
                    driver_id,
                },
            },
            include: {
                Trip: true,
                Passnger: {
                    select: {
                        uuid: true,
                        prefered_language: true,
                        User_FCM_Tokens: true,
                    },
                },
            },
        });
        if (!trip)
            throw new ApiError_1.default('Trip not found', 404);
        const { userWallet, driverWallet } = await this.getWalletsValues(trip.passnger_id, driver_id);
        await client_1.default.$transaction(async (tx) => {
            await this.cancelTrip(trip_id, trip.passnger_id, driver_id, data, trip_1.CanceledBy.DRIVER, tx);
            let newWallet = userWallet;
            if (trip.payment_method === payment_1.PaymentMethod.CASH && trip.user_debt > 0) {
                await tx.user.update({
                    where: {
                        id: trip.passnger_id,
                    },
                    data: {
                        user_wallet_balance: {
                            decrement: trip.user_debt,
                        },
                        Passenger_Wallet_Transaction: {
                            create: {
                                amount: -trip.user_debt,
                                transaction_type: wallet_1.TransactionType.DEBT_UNPAID,
                                previous_balance: userWallet,
                                current_balance: userWallet - trip.user_debt,
                                trip_id,
                            },
                        },
                    },
                });
                newWallet -= trip.user_debt;
            }
            if (data.reason !== trip_1.TripCancelationReason.PICK_UP_OTHERS) {
                await this.driverPenalty(trip.passnger_id, driver_id, trip_id, newWallet, driverWallet, tx);
                await this.create({
                    destination_location_lat: trip.destination_location_lat,
                    destination_location_lng: trip.destination_location_lng,
                    features: trip.Trip.features
                        .filter((feature) => feature !== 'VIP')
                        .map((feature) => feature),
                    gender: trip.Trip.gender,
                    passnger_id: trip.passnger_id,
                    pickup_location_lat: trip.pickup_location_lat,
                    pickup_location_lng: trip.pickup_location_lng,
                    start_date: (0, moment_1.default)().isAfter(trip.Trip.start_date)
                        ? new Date()
                        : trip.Trip.start_date,
                    pickup_description: trip.pickup_description,
                    destination_description: trip.destination_description,
                    distance: trip.Trip.distance,
                });
                newWallet += 25;
            }
            if (trip.app_share_discount > 0) {
                await this.increamentUserAppShareCount(trip.passnger_id, tx);
            }
            if (trip.payment_method === payment_1.PaymentMethod.WALLET
                || trip.payment_method === payment_1.PaymentMethod.CARD) {
                await this.refundUserWallet(trip.passnger_id, trip.Trip.price
                    + trip.user_app_share
                    - trip.app_share_discount
                    - trip.discount, newWallet, trip_id, tx);
            }
        });
        return {
            type: trip.Trip.type,
            users: [
                {
                    uuid: trip.Passnger.uuid,
                    User_FCM_Tokens: trip.Passnger.User_FCM_Tokens,
                    prefered_language: trip.Passnger.prefered_language,
                },
            ],
        };
    }
    async getTripOffers(trip_id, queryString) {
        return (0, pagination_1.paginate)('offers', {
            where: {
                trip_id,
            },
            include: {
                Driver: {
                    select: {
                        name: true,
                        avatar: true,
                        driver_rate: true,
                        Vehicles: {
                            where: {
                                deletedAt: null,
                            },
                            select: {
                                id: true,
                                serial_no: true,
                                plate_alphabet: true,
                                plate_alphabet_ar: true,
                                plate_number: true,
                                seats_no: true,
                                production_year: true,
                                Vehicle_Color: {
                                    select: {
                                        ar_name: true,
                                        en_name: true,
                                    },
                                },
                                Vehicle_Class: {
                                    select: {
                                        ar_name: true,
                                        en_name: true,
                                    },
                                },
                                Vehicle_Type: {
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
                            take: 1,
                        },
                    },
                },
            },
        }, queryString.page, queryString.limit);
    }
    async endTrip(driver_id, trip_id) {
        // Find the trip
        const trip = await client_1.default.trip.findUnique({
            where: {
                id: trip_id,
                driver_id,
            },
            include: {
                VIP_Trip: true,
            },
        });
        // Check if the trip is in progress
        if (!trip || !trip.VIP_Trip)
            throw new ApiError_1.default('Trip not found', 404);
        if (trip.status === trip_1.TripStatus.COMPLETED)
            throw new ApiError_1.default('Trip already ended', 400);
        await tripService_1.default.validateDriverInLocation(trip_id, trip.status);
        let { driverWallet } = await this.getWalletsValues(trip.VIP_Trip.passnger_id, driver_id);
        // Calculate the trip tax
        return client_1.default.$transaction(async (tx) => {
            // Calculate the app share
            const driverAppShare = (trip.price * Number(process.env.APP_SHARE)) / 100;
            const appShareDiscount = trip.VIP_Trip.app_share_discount;
            if (trip.VIP_Trip?.payment_method === payment_1.PaymentMethod.CASH) {
                // Withdraw the user debt from the wallet that got deposited before in the accept offer
                if (trip.VIP_Trip.user_debt > 0) {
                    await tx.user.update({
                        where: {
                            id: driver_id,
                        },
                        data: {
                            driver_wallet_balance: {
                                decrement: trip.VIP_Trip.user_debt,
                            },
                            Driver_Wallet_Transaction: {
                                create: {
                                    amount: -trip.VIP_Trip.user_debt,
                                    transaction_type: wallet_1.TransactionType.USER_DEBT,
                                    previous_balance: driverWallet,
                                    current_balance: driverWallet - trip.VIP_Trip.user_debt,
                                    trip_id,
                                },
                            },
                        },
                    });
                    driverWallet -= trip.VIP_Trip.user_debt;
                }
                if (trip.VIP_Trip.user_app_share - trip.VIP_Trip.app_share_discount
                    > 0) {
                    await tx.user.update({
                        where: {
                            id: driver_id,
                        },
                        data: {
                            driver_wallet_balance: {
                                decrement: trip.VIP_Trip.user_app_share
                                    - trip.VIP_Trip.app_share_discount,
                            },
                            Driver_Wallet_Transaction: {
                                create: {
                                    amount: -(trip.VIP_Trip.user_app_share
                                        - trip.VIP_Trip.app_share_discount),
                                    transaction_type: wallet_1.TransactionType.USER_APP_SHARE,
                                    previous_balance: driverWallet,
                                    current_balance: driverWallet
                                        - (trip.VIP_Trip.user_app_share
                                            - trip.VIP_Trip.app_share_discount),
                                    trip_id,
                                },
                            },
                        },
                    });
                    driverWallet
                        -= trip.VIP_Trip.user_app_share - trip.VIP_Trip.app_share_discount;
                }
            }
            // Update the trip status to completed
            const updatedTrip = await client_1.default.trip.update({
                where: {
                    id: trip_id,
                },
                data: {
                    status: trip_1.TripStatus.COMPLETED,
                    driver_app_share: driverAppShare,
                    user_app_share: trip.VIP_Trip.user_app_share - appShareDiscount,
                    user_debt: trip.VIP_Trip.user_debt,
                    driver_tax: driverAppShare * 0.15,
                    user_tax: (trip.VIP_Trip.user_app_share - appShareDiscount) * 0.15,
                    end_date: new Date(),
                },
                include: {
                    VIP_Trip: {
                        include: {
                            Passnger: {
                                select: {
                                    national_id: true,
                                    uuid: true,
                                    prefered_language: true,
                                    User_FCM_Tokens: true,
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
            const paymentMethod = updatedTrip.VIP_Trip.payment_method;
            // this var to store the amount of the transaction that will be added to the driver wallet
            let transacionsAmount = 0;
            // Update the driver wallet
            if (paymentMethod === payment_1.PaymentMethod.WALLET
                || paymentMethod === payment_1.PaymentMethod.CARD) {
                // Increase Driver wallet with the trip price
                transacionsAmount = updatedTrip.price;
                await tx.user.update({
                    where: {
                        id: driver_id,
                    },
                    data: {
                        driver_wallet_balance: {
                            increment: updatedTrip.price,
                        },
                        Driver_Wallet_Transaction: {
                            create: {
                                amount: updatedTrip.price,
                                transaction_type: wallet_1.TransactionType.COMPLETE_TRIP,
                                previous_balance: driverWallet,
                                current_balance: driverWallet + updatedTrip.price,
                                trip_id,
                            },
                        },
                    },
                });
            }
            // Update the driver wallet with the discount if the payment method is cash
            if (paymentMethod === payment_1.PaymentMethod.CASH && updatedTrip.discount) {
                await tx.user.update({
                    where: {
                        id: driver_id,
                    },
                    data: {
                        driver_wallet_balance: {
                            increment: updatedTrip.discount,
                        },
                        Driver_Wallet_Transaction: {
                            create: {
                                amount: updatedTrip.discount,
                                transaction_type: wallet_1.TransactionType.COMPLETE_TRIP,
                                previous_balance: driverWallet,
                                current_balance: driverWallet + updatedTrip.discount,
                                trip_id,
                            },
                        },
                    },
                });
                transacionsAmount += updatedTrip.discount;
            }
            // Deduct the application percentage from the wallet
            await tx.user.update({
                where: {
                    id: driver_id,
                },
                data: {
                    driver_wallet_balance: {
                        // Handel user app share discount
                        decrement: driverAppShare,
                    },
                    // Create a transaction for the app share even if the app share after the user discount is 0
                    Driver_Wallet_Transaction: {
                        create: {
                            amount: -driverAppShare,
                            transaction_type: wallet_1.TransactionType.APP_SHARE,
                            previous_balance: driverWallet + transacionsAmount,
                            current_balance: driverWallet + transacionsAmount - driverAppShare,
                            trip_id,
                        },
                    },
                },
            });
            // Save Recent Address
            await recentAddressService_1.default.create({
                alias: trip.VIP_Trip?.destination_description,
                description: trip.VIP_Trip?.destination_description,
                lat: trip.VIP_Trip?.destination_location_lat,
                lng: trip.VIP_Trip?.destination_location_lng,
                userId: trip.VIP_Trip?.passnger_id,
            });
            // Return the tripSummary for wasl and the tripStatusInfo for the user
            return {
                tripStatusInfo: {
                    id: updatedTrip.id,
                    status: updatedTrip.status,
                    driverId: driver_id,
                    users: [
                        {
                            uuid: updatedTrip.VIP_Trip?.Passnger.uuid,
                            User_FCM_Tokens: updatedTrip.VIP_Trip?.Passnger.User_FCM_Tokens,
                            prefered_language: updatedTrip.VIP_Trip?.Passnger.prefered_language,
                        },
                    ],
                },
                tripSummary: {
                    sequenceNumber: updatedTrip.Vehicle.serial_no,
                    tripId: trip_id,
                    driverId: updatedTrip.Driver.national_id,
                    startedWhen: updatedTrip.start_date.toISOString(),
                    pickupTimestamp: (0, convertDateToKSA_1.convertDateToKSA)(updatedTrip.pickup_time),
                    dropoffTimestamp: (0, convertDateToKSA_1.convertDateToKSA)(updatedTrip.end_date),
                    distanceInMeters: updatedTrip.distance,
                    durationInSeconds: (updatedTrip.end_date.getTime() - updatedTrip.start_date.getTime()) / 1000,
                    customerRating: 5,
                    customerWaitingTimeInSeconds: Math.ceil(Math.abs((updatedTrip.start_date.getTime() - updatedTrip.pickup_time.getTime()) / 1000)),
                    originLatitude: updatedTrip.VIP_Trip.pickup_location_lat,
                    originLongitude: updatedTrip.VIP_Trip.pickup_location_lng,
                    destinationLatitude: updatedTrip.VIP_Trip.destination_location_lat,
                    destinationLongitude: updatedTrip.VIP_Trip.destination_location_lng,
                    tripCost: updatedTrip.price,
                },
            };
        });
    }
    async getOne(trip_id) {
        const trip = await client_1.default.vIP_Trip.findUnique({
            where: {
                trip_id,
            },
            include: {
                Trip: true,
                Passnger: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                        passenger_rate: true,
                        Hobbies: true,
                    },
                },
            },
        });
        if (!trip)
            throw new ApiError_1.default('Trip not found', 404);
        const tripCount = await client_1.default.trip.count({
            where: {
                OR: [
                    {
                        VIP_Trip: {
                            passnger_id: trip.passnger_id,
                        },
                    },
                    {
                        Basic_Trip: {
                            Passengers: {
                                some: {
                                    passenger_id: trip.passnger_id,
                                    status: trip_1.PassengerTripStatus.COMPLETED,
                                },
                            },
                        },
                    },
                ],
                status: trip_1.TripStatus.COMPLETED,
            },
        });
        return { trips: tripCount, ...trip };
    }
    async refundUserWallet(userId, amount, wallet, trip_id, tx) {
        await tx.user.update({
            where: {
                id: userId,
            },
            data: {
                user_wallet_balance: {
                    increment: amount,
                },
                Passenger_Wallet_Transaction: {
                    create: {
                        amount,
                        transaction_type: wallet_1.TransactionType.CANCELATION_REFUND,
                        previous_balance: wallet,
                        current_balance: wallet + amount,
                        trip_id,
                    },
                },
            },
        });
    }
    async increamentUserAppShareCount(user_id, tx) {
        await tx.user.update({
            where: {
                id: user_id,
            },
            data: {
                discount_app_share_count: {
                    increment: 1,
                },
            },
        });
    }
    async cancelTrip(trip_id, passenger_id, driver_id, data, canceled_by, tx) {
        return tx.trip.update({
            where: {
                id: trip_id,
            },
            data: {
                status: data.reason === trip_1.TripCancelationReason.PICK_UP_OTHERS
                    ? trip_1.TripStatus.ON_HOLD
                    : trip_1.TripStatus.CANCELLED,
                VIP_Trip: {
                    update: {
                        Cancelation: {
                            create: {
                                canceled_by,
                                reason: data.reason,
                                note: data.note,
                                passenger_id,
                                driver_id,
                            },
                        },
                    },
                },
            },
            include: {
                VIP_Trip: true,
            },
        });
    }
    async getWalletsValues(passnger_id, driver_id) {
        const [user, driver] = await Promise.all([
            client_1.default.user.findUnique({
                where: {
                    id: passnger_id,
                },
                select: {
                    user_wallet_balance: true,
                },
            }),
            client_1.default.user.findFirst({
                where: {
                    id: driver_id,
                },
                select: {
                    driver_wallet_balance: true,
                },
            }),
        ]);
        return {
            userWallet: user?.user_wallet_balance || 0,
            driverWallet: driver?.driver_wallet_balance || 0,
        };
    }
    async userPenalty(userId, driver_id, trip_id, userWallet, driverWallet, tx) {
        await tx.user.update({
            where: {
                id: userId,
            },
            data: {
                user_wallet_balance: {
                    decrement: 25,
                },
                passenger_cancel_count: { increment: 1 },
                Passenger_Wallet_Transaction: {
                    create: {
                        amount: -25,
                        transaction_type: wallet_1.TransactionType.CANCELATION_PENALTY,
                        previous_balance: userWallet,
                        current_balance: userWallet - 25,
                        trip_id,
                    },
                },
            },
        });
        await tx.user.update({
            where: {
                id: driver_id,
            },
            data: {
                driver_wallet_balance: {
                    increment: 25,
                },
                Driver_Wallet_Transaction: {
                    create: {
                        amount: 25,
                        transaction_type: wallet_1.TransactionType.CANCELATION_COMPENSATION,
                        previous_balance: driverWallet,
                        current_balance: driverWallet + 25,
                        trip_id,
                    },
                },
            },
        });
    }
    async driverPenalty(userId, driver_id, trip_id, userWallet, driverWallet, tx) {
        await tx.user.update({
            where: {
                id: driver_id,
            },
            data: {
                driver_wallet_balance: {
                    decrement: 25,
                },
                driver_cancel_count: { increment: 1 },
                Driver_Wallet_Transaction: {
                    create: {
                        amount: -25,
                        transaction_type: wallet_1.TransactionType.CANCELATION_PENALTY,
                        previous_balance: driverWallet,
                        current_balance: driverWallet - 25,
                        trip_id,
                    },
                },
            },
        });
        await tx.user.update({
            where: {
                id: userId,
            },
            data: {
                user_wallet_balance: {
                    increment: 25,
                },
                Passenger_Wallet_Transaction: {
                    create: {
                        amount: 25,
                        transaction_type: wallet_1.TransactionType.CANCELATION_COMPENSATION,
                        previous_balance: userWallet,
                        current_balance: userWallet + 25,
                        trip_id,
                    },
                },
            },
        });
    }
}
exports.VipTripService = VipTripService;
const vipTripService = new VipTripService();
exports.default = vipTripService;
