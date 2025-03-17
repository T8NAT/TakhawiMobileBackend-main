"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_1 = __importDefault(require("../utils/response"));
const driverService_1 = __importDefault(require("../services/driverService"));
class DriverController {
    async uploadNationalID(req, res, next) {
        try {
            const { user, role } = req;
            const { national_id } = req.body;
            await driverService_1.default.uploadNationalID(user, national_id, role, req.files);
            (0, response_1.default)(res, 201, {
                status: true,
                message: 'National ID uploaded successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
    async uploadDriverLicense(req, res, next) {
        try {
            const userId = req.user;
            await driverService_1.default.uploadDriverLicense(userId, req.files);
            (0, response_1.default)(res, 201, {
                status: true,
                message: 'Driver license uploaded successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
    async checkUploadStatus(req, res, next) {
        try {
            const { temp_id } = req;
            const status = await driverService_1.default.checkUploadStatus(temp_id);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Upload status checked successfully',
                result: status,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getNearestDrivers(req, res, next) {
        try {
            const { gender } = req;
            const drivers = await driverService_1.default.getNearestDrivers({ lat: +req.query.lat, lng: +req.query.lng }, gender, 10);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Drivers fetched successfully',
                result: drivers,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
const driverController = new DriverController();
exports.default = driverController;
