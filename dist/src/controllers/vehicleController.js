"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const roles_1 = require("../enum/roles");
const vehicleService_1 = __importDefault(require("../services/vehicleService"));
const response_1 = __importDefault(require("../utils/response"));
const vehicle_serialization_1 = require("../utils/serialization/vehicle.serialization");
class VehicleController {
    async create(req, res, next) {
        try {
            const { user, temp_id, language, skipLang, } = req;
            const vehicle = await vehicleService_1.default.create({ ...req.body, driverId: user }, temp_id);
            (0, response_1.default)(res, 201, {
                status: true,
                message: 'Vehicle created successfully',
                result: skipLang ? vehicle : (0, vehicle_serialization_1.serializeVehicle)(vehicle, language),
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getAll(req, res, next) {
        try {
            const { language, skipLang } = req;
            const { pagination, data } = await vehicleService_1.default.getAll(req.query);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Vehicles fetched successfully',
                pagination,
                result: skipLang ? data : (0, vehicle_serialization_1.serializeVehicles)(data, language),
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getOne(req, res, next) {
        try {
            const { user, role, language, skipLang, } = req;
            const { id } = req.params;
            const vehicle = await vehicleService_1.default.getOne(+id, role === roles_1.Roles.DRIVER ? user : undefined);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Vehicle fetched successfully',
                result: skipLang ? vehicle : (0, vehicle_serialization_1.serializeVehicle)(vehicle, language),
            });
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const { user, role, language, skipLang, } = req;
            const { id } = req.params;
            const vehicle = await vehicleService_1.default.update(req.body, +id, role === roles_1.Roles.DRIVER ? user : undefined);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Vehicle updated successfully',
                result: skipLang ? vehicle : (0, vehicle_serialization_1.serializeVehicle)(vehicle, language),
            });
        }
        catch (error) {
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            const { user, role } = req;
            const { id } = req.params;
            await vehicleService_1.default.delete(+id, role === roles_1.Roles.DRIVER ? user : undefined);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Vehicle deleted successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
    async uploadVehicleImages(req, res, next) {
        try {
            const { temp_id } = req;
            const vehicleImages = await vehicleService_1.default.uploadVehicleImages(temp_id, req.files);
            (0, response_1.default)(res, 201, {
                status: true,
                message: 'Images uploaded successfully',
                result: vehicleImages,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async uploadVehicleLicence(req, res, next) {
        try {
            const { temp_id } = req;
            const vehicleLicence = await vehicleService_1.default.uploadVehicleLicence(temp_id, req.files);
            (0, response_1.default)(res, 201, {
                status: true,
                message: 'Images uploaded successfully',
                result: vehicleLicence,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async uploadVehicleInsurance(req, res, next) {
        try {
            const { temp_id } = req;
            const file_path = req.file.path;
            const vehicleInsurance = await vehicleService_1.default.uploadVehicleInsurance(temp_id, file_path);
            (0, response_1.default)(res, 201, {
                status: true,
                message: 'Insurance uploaded successfully',
                result: vehicleInsurance,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async addNewVehicle(req, res, next) {
        try {
            const { user } = req;
            const vehicle = await vehicleService_1.default.addNewVehicle({ ...req.body, driverId: user }, req.files);
            (0, response_1.default)(res, 201, {
                status: true,
                message: 'Vehicle created successfully',
                result: vehicle,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
const vehicleController = new VehicleController();
exports.default = vehicleController;
