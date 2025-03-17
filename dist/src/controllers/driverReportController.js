"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const driverReportService_1 = __importDefault(require("../services/driverReportService"));
const response_1 = __importDefault(require("../utils/response"));
const tripReport_serializatio_1 = require("../utils/serialization/tripReport.serializatio");
class DriverReportController {
    async getDriverReportPerMonth(req, res, next) {
        try {
            const driverId = req.user;
            const profit = await driverReportService_1.default.getDriverReportPerMonth(driverId, req.query.noOfMonth);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Driver report fetched successfully',
                result: profit,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getDriverProfitReport(req, res, next) {
        try {
            const { user: driverId, language } = req;
            const { data, pagination } = await driverReportService_1.default.getDriverProfitReport(driverId, language, req.query);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Driver profit report fetched successfully',
                result: data,
                pagination,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getOneTripReport(req, res, next) {
        try {
            const { user: driverId, language } = req;
            const trip = await driverReportService_1.default.getOneTripReport(driverId, +req.params.tripId);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Driver trip report fetched successfully',
                result: (0, tripReport_serializatio_1.serializeTripReportObject)(trip, language),
            });
        }
        catch (error) {
            next(error);
        }
    }
    async tripReviewReport(req, res, next) {
        try {
            const { user: driverId } = req;
            const reviews = await driverReportService_1.default.tripReviewReport(driverId, +req.params.tripId);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Driver trip reviews fetched successfully',
                result: reviews,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getDriverFinancialSummary(req, res, next) {
        try {
            const { user } = req;
            const financialSummary = await driverReportService_1.default.getDriverFinancialSummary(user);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Driver financial summary fetched successfully',
                result: financialSummary,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
const driverReportController = new DriverReportController();
exports.default = driverReportController;
