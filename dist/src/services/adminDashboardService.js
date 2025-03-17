"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __importDefault(require("../../prisma/client"));
const trip_1 = require("../enum/trip");
const userStatus_1 = require("../enum/userStatus");
const pagination_1 = require("../utils/pagination");
class AdminDashboardService {
    async getDriverStatistics() {
        const driver_status = {
            [userStatus_1.UserStatus.REGISTERED]: 0,
            [userStatus_1.UserStatus.PENDING]: 0,
            [userStatus_1.UserStatus.REJECTED]: 0,
            [userStatus_1.UserStatus.APPROVED]: 0,
            [userStatus_1.UserStatus.SUSPENDED]: 0,
        };
        const drivers = await client_1.default.user.groupBy({
            by: ['driver_status'],
            _count: true,
        });
        drivers.forEach((driver) => {
            if (driver_status.hasOwnProperty(driver.driver_status)) {
                driver_status[driver.driver_status] = driver._count;
            }
        });
        return driver_status;
    }
    async getTripStatistics() {
        const basicTrips = await client_1.default.trip.groupBy({
            by: ['status'],
            _count: true,
            where: {
                type: trip_1.TripType.BASICTRIP,
            },
        });
        const basic_trip_status = {
            [trip_1.TripStatus.COMPLETED]: 0,
            [trip_1.TripStatus.CANCELLED]: 0,
        };
        basicTrips.forEach((trip) => {
            if (basic_trip_status.hasOwnProperty(trip.status)) {
                basic_trip_status[trip.status] = trip._count;
            }
        });
        const vipTrips = await client_1.default.trip.groupBy({
            by: ['status'],
            _count: true,
            where: {
                type: trip_1.TripType.VIPTRIP,
            },
        });
        const vip_trip_status = {
            [trip_1.TripStatus.COMPLETED]: 0,
            [trip_1.TripStatus.CANCELLED]: 0,
        };
        vipTrips.forEach((trip) => {
            if (vip_trip_status.hasOwnProperty(trip.status)) {
                vip_trip_status[trip.status] = trip._count;
            }
        });
        return {
            basic_trip_status,
            vip_trip_status,
        };
    }
    async getUserTransactions(query, modelName) {
        let userId;
        modelName === 'driver_Wallet_Transaction'
            ? (userId = 'driver_id')
            : (userId = 'passenger_id');
        return (0, pagination_1.paginate)(modelName, {
            where: {
                [userId]: query.user_id ? +query.user_id : undefined,
                transaction_type: query.transaction_type,
            },
        }, query.page, query.limit);
    }
    async generateEarningsReport() {
        let completedTripsEarningsSummary;
        const earnings = await client_1.default.trip.aggregate({
            where: {
                status: trip_1.TripStatus.COMPLETED,
            },
            _sum: {
                price: true,
                discount: true,
                driver_app_share: true,
                user_app_share: true,
                user_debt: true,
            },
        });
        return (completedTripsEarningsSummary = {
            total_trip_price: earnings._sum.price ?? 0,
            net_profit: earnings._sum.user_app_share +
                earnings._sum.driver_app_share -
                earnings._sum.discount,
            discount: earnings._sum.discount ?? 0,
            user_app_share: earnings._sum.user_app_share ?? 0,
            driver_app_share: earnings._sum.driver_app_share ?? 0,
        });
    }
}
const adminDashboardService = new AdminDashboardService();
exports.default = adminDashboardService;
