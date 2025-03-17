"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_1 = __importDefault(require("../utils/response"));
const waslService_1 = __importDefault(require("../services/waslService"));
const roles_1 = require("../enum/roles");
class WaslController {
    async createDriverandVehicleRegistration(req, res, next) {
        try {
            const { user, role } = req;
            const userId = role === roles_1.Roles.DRIVER ? user : req.body.userId;
            const wasl = await waslService_1.default.createDriverandVehicleRegistration(userId);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Driver and Vehicle registration created successfully',
                result: wasl,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getDriverandVehicleRegistration(req, res, next) {
        try {
            const { user, role } = req;
            const userId = role === roles_1.Roles.DRIVER ? user : +req.query.userId;
            const wasl = await waslService_1.default.getDriverandVehicleRegistration(userId);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Driver and Vehicle registration fetched successfully',
                result: wasl,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async createTripRegistration(req, res, next) {
        try {
            const trip = await waslService_1.default.createTripRegistration(req.body);
            (0, response_1.default)(res, 200, {
                status: trip.status,
                message: trip.success ? 'Trip created successfully' : trip.result_code,
                result: trip,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getTripsLog(req, res, next) {
        try {
            const trips = await waslService_1.default.getTripsLog(req.query);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Trips log fetched successfully',
                result: trips,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
const waslController = new WaslController();
exports.default = waslController;
