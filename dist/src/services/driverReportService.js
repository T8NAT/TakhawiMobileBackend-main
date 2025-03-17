"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const client_1 = __importDefault(require("../../prisma/client"));
const trip_1 = require("../enum/trip");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
class DriverReportService {
    async getDriverReportPerMonth(driverId, noOfMonth) {
        const startDate = (0, moment_1.default)().subtract(+noOfMonth - 1, 'months').startOf('month').toDate();
        const endDate = (0, moment_1.default)().endOf('month').toDate();
        const result = await client_1.default.$queryRaw `
        WITH DateSeries AS (
          SELECT 
            generate_series(
              DATE(${startDate}),
              DATE(${endDate}),
              '1 month'::interval
            ) AS Date
        )
        SELECT 
          to_char(ds.Date, 'YYYY-MM') AS date,
          COALESCE(SUM(t.price), 0) AS total_trips_price,
          COALESCE(SUM(t.price - t.driver_app_share), 0) AS driver_profit,
          COALESCE(SUM(t.distance), 0) AS total_distance
        FROM 
          DateSeries ds
        LEFT JOIN 
          "Trip" t ON EXTRACT(YEAR FROM t.start_date) = EXTRACT(YEAR FROM ds.Date) 
          AND EXTRACT(MONTH FROM t.start_date) = EXTRACT(MONTH FROM ds.Date)
          AND t.driver_id = ${driverId}
          AND t.status = ${trip_1.TripStatus.COMPLETED}
          AND t.start_date BETWEEN ${startDate} AND ${endDate}
        GROUP BY 
          ds.Date
        ORDER BY 
          date
      `;
        const totalRevenue = await client_1.default.trip.aggregate({
            _sum: {
                driver_app_share: true,
                price: true,
                distance: true,
            },
            _count: {
                id: true,
            },
            where: {
                driver_id: driverId,
                status: trip_1.TripStatus.COMPLETED,
                start_date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        });
        const tripRevenue = {
            totalRevenue: {
                driver_profit: (totalRevenue._sum.price ?? 0) - (totalRevenue._sum.driver_app_share ?? 0),
                total_trips_price: totalRevenue._sum.price ?? 0,
                total_distance: totalRevenue._sum.distance ?? 0,
                total_trips: totalRevenue._count.id,
            },
            monthlyRevenue: result,
        };
        return tripRevenue;
    }
    async getDriverProfitReport(driverId, lang, query) {
        const { totalProfit, totalTrips } = await this.getTripPrice(driverId);
        const { page = 1, limit = 10 } = query;
        const offset = (page - 1) * limit;
        const tripsReport = await client_1.default.$queryRaw `
         SELECT 
           "Trip".id AS tripId,
           COALESCE(AVG("Reviews".rate), 0) AS avgRating,
           CASE 
             WHEN "VIP_Trip".trip_id IS NOT NULL THEN "VIP_Trip".pickup_description 
             ELSE CASE WHEN ${lang} = 'en' THEN "Pickup_Location".en_name ELSE "Pickup_Location".ar_name END
           END AS pickupLocation,
           CASE 
             WHEN "VIP_Trip".trip_id IS NOT NULL THEN "VIP_Trip".destination_description 
             ELSE CASE WHEN ${lang} = 'en' THEN "Destination_Location".en_name ELSE "Destination_Location".ar_name END
           END AS destinationLocation,
           "Trip".start_date
         FROM "Trip"
         LEFT JOIN "Reviews" ON "Trip".id = "Reviews".trip_id
         AND "Reviews".target_id = ${driverId}
         LEFT JOIN "VIP_Trip" ON "Trip".id = "VIP_Trip".trip_id
         LEFT JOIN "Basic_Trip" ON "Trip".id = "Basic_Trip".trip_id
         LEFT JOIN "Meeting_Location" AS "Pickup_Location" ON "Basic_Trip".pickup_location_id = "Pickup_Location".id
         LEFT JOIN "Meeting_Location" AS "Destination_Location" ON "Basic_Trip".destination_id = "Destination_Location".id
         WHERE "Trip".driver_id = ${driverId}
         AND "Trip".status = 'COMPLETED'
         GROUP BY "Trip".id, "VIP_Trip".trip_id, "VIP_Trip".pickup_description, "VIP_Trip".destination_description, 
           "Pickup_Location".en_name, "Pickup_Location".ar_name, 
           "Destination_Location".en_name, "Destination_Location".ar_name, "Trip".start_date
         ORDER BY "Trip".start_date DESC
         LIMIT ${+limit}
         OFFSET ${offset};
       `;
        return {
            data: {
                totalProfit,
                tripsReport,
            },
            pagination: {
                totalPages: Math.ceil(totalTrips / limit),
                totalItems: totalTrips,
                page: +page,
                limit: +limit,
            },
        };
    }
    async getOneTripReport(driverId, tripId) {
        const tripReport = await client_1.default.trip.findUnique({
            where: {
                id: tripId,
                driver_id: driverId,
                status: trip_1.TripStatus.COMPLETED,
            },
            select: {
                id: true,
                start_date: true,
                end_date: true,
                driver_app_share: true,
                Basic_Trip: {
                    select: {
                        price_per_seat: true,
                        Passengers: {
                            where: {
                                status: trip_1.PassengerTripStatus.COMPLETED,
                            },
                            select: {
                                payment_method: true,
                                discount: true,
                                app_share_discount: true,
                                user_app_share: true,
                                Passnger: {
                                    select: {
                                        name: true,
                                        avatar: true,
                                        passenger_rate: true,
                                    },
                                },
                            },
                        },
                        Pickup_Location: true,
                        Destination: true,
                    },
                },
                VIP_Trip: {
                    select: {
                        app_share_discount: true,
                        user_app_share: true,
                        discount: true,
                        payment_method: true,
                        pickup_description: true,
                        destination_description: true,
                        Passnger: {
                            select: {
                                name: true,
                                avatar: true,
                                passenger_rate: true,
                            },
                        },
                    },
                },
                price: true,
            },
        });
        if (!tripReport) {
            throw new ApiError_1.default('Trip not found', 404);
        }
        return tripReport;
    }
    async tripReviewReport(driverId, tripId) {
        const reviews = await client_1.default.reviews.findMany({
            where: {
                target_id: driverId,
                trip_id: tripId,
            },
            include: {
                Reviewers: {
                    select: {
                        name: true,
                        avatar: true,
                    },
                },
            },
        });
        if (reviews.length === 0) {
            throw new ApiError_1.default('Reviews not found', 404);
        }
        return reviews;
    }
    async getDriverFinancialSummary(driverId) {
        const startDate = moment_1.default.utc().subtract(6, 'days').startOf('day').toDate();
        const endDate = moment_1.default.utc().endOf('day').toDate();
        const result = await client_1.default.$queryRaw `
        WITH DateSeries AS (
          SELECT
            generate_series(
              ${startDate}::date, 
              ${endDate}::date - INTERVAL '1 second',
              '1 day'::interval
            ) AS Date
        )
        SELECT
          trim(to_char(Date, 'YYYY-MM-DD Day')) AS date,
          COALESCE(SUM(t.price), 0) AS total_trips_price,
          COALESCE(SUM(t.price - t.driver_app_share), 0) AS driver_profit,
          COALESCE(SUM(t.distance), 0) AS total_distance
        FROM
          DateSeries ds
        LEFT JOIN
          "Trip" t ON EXTRACT(MONTH FROM t.start_date) = EXTRACT(MONTH FROM ds.Date)
          AND EXTRACT(DAY FROM t.start_date) = EXTRACT(DAY FROM ds.Date)
          AND t.driver_id = ${driverId}
          AND t.status = ${trip_1.TripStatus.COMPLETED}
          AND t.start_date BETWEEN ${startDate} AND ${endDate}
        GROUP BY
          ds.Date
        ORDER BY
          date
      `;
        const driver = await client_1.default.user.findUnique({
            where: {
                id: driverId,
            },
            select: {
                driver_wallet_balance: true,
            },
        });
        if (!driver) {
            throw new ApiError_1.default('Driver not found', 404);
        }
        const { totalProfit, totalTrips } = await this.getTripPrice(driverId);
        return {
            totalProfit,
            totalTrips,
            driverWalletBalance: driver.driver_wallet_balance,
            dailyRevenue: result,
        };
    }
    async getTripPrice(driverId) {
        const tripsPrice = await client_1.default.trip.aggregate({
            _sum: {
                driver_app_share: true,
                price: true,
            },
            _count: {
                id: true,
            },
            where: {
                driver_id: driverId,
                status: trip_1.TripStatus.COMPLETED,
            },
        });
        return {
            totalProfit: (tripsPrice._sum.price ?? 0) - (tripsPrice._sum.driver_app_share ?? 0),
            totalTrips: tripsPrice._count.id,
        };
    }
}
const driverReportService = new DriverReportService();
exports.default = driverReportService;
