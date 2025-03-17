"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __importDefault(require("../../prisma/client"));
const roles_1 = require("../enum/roles");
const trip_1 = require("../enum/trip");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const getDistance_1 = require("../utils/getDistance");
const pagination_1 = require("../utils/pagination");
const promoCodeService_1 = __importDefault(require("./promoCodeService"));
class TripService {
    async getCompletedTrips(userId, query, role) {
        return (0, pagination_1.paginate)('trip', {
            where: role === roles_1.Roles.DRIVER
                ? {
                    status: trip_1.TripStatus.COMPLETED,
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
                                        status: trip_1.PassengerTripStatus.COMPLETED,
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
                    status: trip_1.TripStatus.COMPLETED,
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
                        Passengers: role === roles_1.Roles.DRIVER
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
                                    status: trip_1.PassengerTripStatus.COMPLETED,
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
                        Passnger: role === roles_1.Roles.DRIVER
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
                Driver: role !== roles_1.Roles.DRIVER
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
        }, query.page, query.limit);
    }
    async getCancelledTrips(userId, query, role) {
        return (0, pagination_1.paginate)('trip', {
            where: role === roles_1.Roles.DRIVER
                ? {
                    status: trip_1.TripStatus.CANCELLED,
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
                                                status: trip_1.PassengerTripStatus.CANCELLED_BY_PASSENGER,
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
                            status: trip_1.TripStatus.CANCELLED,
                        },
                        {
                            Basic_Trip: {
                                Passengers: {
                                    some: {
                                        passenger_id: userId,
                                    },
                                },
                            },
                            status: trip_1.TripStatus.CANCELLED,
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
                        Passengers: role === roles_1.Roles.DRIVER
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
                        Passnger: role === roles_1.Roles.DRIVER
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
                Driver: role !== roles_1.Roles.DRIVER
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
        }, query.page, query.limit);
    }
    async getUpcomingTrips(userId, query, role) {
        return (0, pagination_1.paginate)('trip', {
            where: role === roles_1.Roles.DRIVER
                ? {
                    start_date: {
                        gte: new Date(),
                    },
                    status: { notIn: [trip_1.TripStatus.CANCELLED, trip_1.TripStatus.COMPLETED] },
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
                                            notIn: [trip_1.PassengerTripStatus.CANCELLED_BY_PASSENGER, trip_1.PassengerTripStatus.COMPLETED],
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
                    status: { notIn: [trip_1.TripStatus.CANCELLED, trip_1.TripStatus.COMPLETED] },
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
                        Passengers: role === roles_1.Roles.DRIVER
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
                                        not: trip_1.PassengerTripStatus.CANCELLED_BY_PASSENGER,
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
                        Passnger: role === roles_1.Roles.DRIVER
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
                Driver: role !== roles_1.Roles.DRIVER
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
        }, query.page, query.limit);
    }
    async getTrips(query) {
        return (0, pagination_1.paginate)('trip', {
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
        }, query.page, query.limit);
    }
    async updateTripStatus(tripId, status, driverId) {
        await this.tripCheck(tripId, driverId);
        await this.validateDriverInLocation(tripId, status);
        const trip = await client_1.default.trip.update({
            where: {
                id: tripId,
            },
            data: {
                status,
                pickup_time: status === trip_1.TripStatus.INPROGRESS ? new Date() : null,
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
                                        trip_1.PassengerTripStatus.CANCELLED_BY_PASSENGER,
                                        trip_1.PassengerTripStatus.ON_HOLD,
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
        if (trip.type === trip_1.TripType.VIPTRIP) {
            return {
                id: tripId,
                status: trip.status,
                driverId,
                users: [
                    {
                        uuid: trip.VIP_Trip?.Passnger.uuid,
                        User_FCM_Tokens: trip.VIP_Trip?.Passnger.User_FCM_Tokens,
                        prefered_language: trip.VIP_Trip?.Passnger.prefered_language,
                    },
                ],
            };
        }
        return {
            id: tripId,
            status: trip.status,
            driverId,
            users: trip.Basic_Trip?.Passengers.map((p) => p.Passnger),
        };
    }
    async tripCheck(tripId, driverId) {
        const trip = await client_1.default.trip.findUnique({
            where: {
                id: tripId,
                driver_id: driverId,
            },
        });
        if (!trip) {
            throw new ApiError_1.default('Trip not found', 404);
        }
        return trip;
    }
    async getActiveTrip(userId, role) {
        // TODO: Change Search Criteria After Mark's Confirmation
        return client_1.default.trip.findFirst({
            where: role === roles_1.Roles.USER
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
                                                trip_1.PassengerTripStatus.JOINED,
                                                trip_1.PassengerTripStatus.ON_HOLD,
                                            ],
                                        },
                                    },
                                },
                            },
                        },
                    ],
                    status: trip_1.TripStatus.ON_WAY,
                }
                : {
                    driver_id: userId,
                    status: trip_1.TripStatus.ON_WAY,
                },
            select: {
                id: true,
                start_date: true,
                status: true,
                type: true,
                Driver: role === roles_1.Roles.USER
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
                Vehicle: role === roles_1.Roles.USER
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
                        Passengers: role === roles_1.Roles.DRIVER
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
    async getNearByVipTrips(query) {
        const { lat, lng, gender, distance, } = query;
        const d = distance ? Math.ceil(+distance) : 30;
        const trips = await client_1.default.$queryRaw `
      SELECT 
        subquery.*,
        (
          SELECT COUNT(*)::int
          FROM (
            -- Count completed trips for the passenger in basic trips
            SELECT pt.id
            FROM "Passenger_Trip" pt
            JOIN "Basic_Trip" bt ON pt.trip_id = bt.trip_id
            WHERE pt.status = ${trip_1.PassengerTripStatus.COMPLETED}
              AND pt.passenger_id = subquery.passenger_id
            UNION ALL
            -- Count completed trips for the passenger in VIP trips
            SELECT vt.trip_id
            FROM "VIP_Trip" vt
            JOIN "Trip" t ON vt.trip_id = t.id
            WHERE vt.passnger_id = subquery.passenger_id
              AND t.status = ${trip_1.TripStatus.COMPLETED}
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
              (sin(radians((v.pickup_location_lat - ${+lat}) / 2))) ^ 2 +
              cos(radians(${+lat})) * cos(radians(v.pickup_location_lat)) *
              (sin(radians((v.pickup_location_lng - ${+lng}) / 2))) ^ 2
            )
          ) as distance
        FROM "Trip" t
        JOIN "VIP_Trip" v ON t.id = v.trip_id
        JOIN "User" u ON v.passnger_id = u.id
        WHERE t.gender = ${gender}
          AND t.type = ${trip_1.TripType.VIPTRIP}
          AND t.status = ${trip_1.TripStatus.PENDING}
          AND t."deletedAt" IS NULL
      ) AS subquery
      WHERE distance < ${d}
      ORDER BY distance
    `;
        return trips;
    }
    async getOne(tripId, userId, role) {
        const trip = await client_1.default.trip.findFirst({
            where: {
                id: tripId,
            },
            select: {
                id: true,
                start_date: true,
                status: true,
                type: true,
                price: true,
                Driver: role === roles_1.Roles.USER
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
                Vehicle: role === roles_1.Roles.USER
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
                        Passengers: role === roles_1.Roles.DRIVER
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
        if (!trip)
            throw new ApiError_1.default('Trip not found', 404);
        return trip;
    }
    async calculateTripPrice(data) {
        let price = 0;
        let appShare = 0;
        let discount = 0;
        let userDebt = 0;
        let promo_code_id;
        const passenger = await client_1.default.user.findUnique({
            where: { id: data.passenger_id },
            select: {
                id: true,
                discount_app_share_count: true,
                user_wallet_balance: true,
            },
        });
        if (!passenger)
            throw new ApiError_1.default('Passenger not found', 404);
        // Determine if the calculation is for a basic trip or a VIP trip
        if (data.type === trip_1.TripType.BASICTRIP) {
            const trip = await client_1.default.basic_Trip.findUnique({
                where: { trip_id: data.id },
            });
            if (!trip)
                throw new ApiError_1.default('Trip not found', 404);
            const userAppShare = +process.env.USER_APP_SHARE;
            const appShareDiscount = passenger.discount_app_share_count > 0 ? userAppShare : 0;
            appShare = userAppShare - appShareDiscount;
            price = trip.price_per_seat;
        }
        else {
            // VIP Trip
            const offer = await client_1.default.offers.findUnique({
                where: {
                    id: data.id,
                    Trip: { passnger_id: data.passenger_id },
                    status: { in: [trip_1.OfferStatus.PENDING, trip_1.OfferStatus.PENDING_PAYMENT] },
                },
            });
            if (!offer)
                throw new ApiError_1.default('Offer not found', 404);
            appShare = offer.user_app_share - offer.app_share_discount;
            price = offer.price;
        }
        // Calculate user debt based on negative wallet balance
        userDebt = passenger.user_wallet_balance < 0
            ? passenger.user_wallet_balance * -1
            : 0;
        // Apply promo code if provided
        if (data.coupon) {
            const promoCode = await promoCodeService_1.default.applyPromoCode(data.coupon, passenger.id, price);
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
    async validateDriverInLocation(tripId, status) {
        if (status === trip_1.TripStatus.ARRIVED || status === trip_1.TripStatus.COMPLETED) {
            const trip = await client_1.default.trip.findUnique({
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
                latitude: trip?.VIP_Trip?.pickup_location_lat ?? trip?.Basic_Trip?.Pickup_Location?.location?.lat,
                longitude: trip?.VIP_Trip?.pickup_location_lng ?? trip?.Basic_Trip?.Pickup_Location?.location?.lng,
            };
            const end = {
                latitude: trip?.Driver?.location?.lat,
                longitude: trip?.Driver?.location?.lng,
            };
            const distance = (0, getDistance_1.getDistance)(start, end, 'km');
            if (distance > 1) {
                const locationType = status === trip_1.TripStatus.ARRIVED ? 'pickup' : 'destination';
                throw new ApiError_1.default(`You are not in the ${locationType} location`, 400);
            }
        }
    }
}
const tripService = new TripService();
exports.default = tripService;
