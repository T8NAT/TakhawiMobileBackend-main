"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const adminDashboardService_1 = __importDefault(require("../services/adminDashboardService"));
const response_1 = __importDefault(require("../utils/response"));
class AdminDashboardController {
    async getDriverStatistics(req, res, next) {
        try {
            const driverStatistics = await adminDashboardService_1.default.getDriverStatistics();
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Driver statistics fetched successfully',
                result: driverStatistics,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getTripStatistics(req, res, next) {
        try {
            const tripStatistics = await adminDashboardService_1.default.getTripStatistics();
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Trip statistics fetched successfully',
                result: tripStatistics,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getPassengerTransactions(req, res, next) {
        try {
            const userTransactions = await adminDashboardService_1.default.getUserTransactions(req.query, 'passenger_Wallet_Transaction');
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'User transactions fetched successfully',
                result: userTransactions,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getDriverTransactions(req, res, next) {
        try {
            const userTransactions = await adminDashboardService_1.default.getUserTransactions(req.query, 'driver_Wallet_Transaction');
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'User transactions fetched successfully',
                result: userTransactions,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async generateEarningsReport(req, res, next) {
        try {
            const earningsReport = await adminDashboardService_1.default.generateEarningsReport();
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Earnings report generated successfully',
                result: earningsReport,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
const adminDashboardController = new AdminDashboardController();
exports.default = adminDashboardController;
