"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_1 = __importDefault(require("../utils/response"));
const vehicleDetailsService_1 = __importDefault(require("../services/vehicleDetailsService"));
const vehicle_serialization_1 = require("../utils/serialization/vehicle.serialization");
class VehicleDetailController {
    async getVehicleColors(req, res, next) {
        try {
            const vehicleColors = await vehicleDetailsService_1.default.getVehicleDetails(VehicleDetailController.modelName.vehicle_color);
            const { language, skipLang } = req;
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Vehicle colors fetched successfully',
                result: skipLang
                    ? vehicleColors
                    : (0, vehicle_serialization_1.serializeVehicleDetails)(vehicleColors, language),
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getVehicleColorById(req, res, next) {
        try {
            const vehicleColor = await vehicleDetailsService_1.default.getVehicleDetailById(VehicleDetailController.modelName.vehicle_color, +req.params.id);
            const { language, skipLang } = req;
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Vehicle color fetched successfully',
                result: skipLang
                    ? vehicleColor
                    : (0, vehicle_serialization_1.serializeVehicleDetail)(vehicleColor, language),
            });
        }
        catch (error) {
            next(error);
        }
    }
    async createVehicleColor(req, res, next) {
        try {
            const vehicleColor = await vehicleDetailsService_1.default.createVehicleDetail(VehicleDetailController.modelName.vehicle_color, req.body);
            (0, response_1.default)(res, 201, {
                status: true,
                message: 'Vehicle color created successfully',
                result: vehicleColor,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async updateVehicleColor(req, res, next) {
        try {
            const vehicleColor = await vehicleDetailsService_1.default.updateVehicleDetail(VehicleDetailController.modelName.vehicle_color, +req.params.id, req.body);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Vehicle color updated successfully',
                result: vehicleColor,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async deleteVehicleColor(req, res, next) {
        try {
            await vehicleDetailsService_1.default.deleteVehicleDetail(VehicleDetailController.modelName.vehicle_color, +req.params.id);
            (0, response_1.default)(res, 204, {
                status: true,
                message: 'Vehicle color deleted successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getVehicleClasses(req, res, next) {
        try {
            const vehicleClasses = await vehicleDetailsService_1.default.getVehicleDetails(VehicleDetailController.modelName.vehicle_class);
            const { language, skipLang } = req;
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Vehicle classes fetched successfully',
                result: skipLang
                    ? vehicleClasses
                    : (0, vehicle_serialization_1.serializeVehicleDetails)(vehicleClasses, language),
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getVehicleClassById(req, res, next) {
        try {
            const vehicleClass = await vehicleDetailsService_1.default.getVehicleDetailById(VehicleDetailController.modelName.vehicle_class, +req.params.id);
            const { language, skipLang } = req;
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Vehicle class fetched successfully',
                result: skipLang
                    ? vehicleClass
                    : (0, vehicle_serialization_1.serializeVehicleDetail)(vehicleClass, language),
            });
        }
        catch (error) {
            next(error);
        }
    }
    async createVehicleClass(req, res, next) {
        try {
            const vehicleClass = await vehicleDetailsService_1.default.createVehicleDetail(VehicleDetailController.modelName.vehicle_class, req.body);
            (0, response_1.default)(res, 201, {
                status: true,
                message: 'Vehicle class created successfully',
                result: vehicleClass,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async updateVehicleClass(req, res, next) {
        try {
            const vehicleClass = await vehicleDetailsService_1.default.updateVehicleDetail(VehicleDetailController.modelName.vehicle_class, +req.params.id, req.body);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Vehicle class updated successfully',
                result: vehicleClass,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async deleteVehicleClass(req, res, next) {
        try {
            await vehicleDetailsService_1.default.deleteVehicleDetail(VehicleDetailController.modelName.vehicle_class, +req.params.id);
            (0, response_1.default)(res, 204, {
                status: true,
                message: 'Vehicle class deleted successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getVehicleTypes(req, res, next) {
        try {
            const vehicleTypes = await vehicleDetailsService_1.default.getVehicleDetails(VehicleDetailController.modelName.vehicle_type);
            const { language, skipLang } = req;
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Vehicle types fetched successfully',
                result: skipLang
                    ? vehicleTypes
                    : (0, vehicle_serialization_1.serializeVehicleDetails)(vehicleTypes, language),
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getVehicleTypeById(req, res, next) {
        try {
            const vehicleType = await vehicleDetailsService_1.default.getVehicleDetailById(VehicleDetailController.modelName.vehicle_type, +req.params.id);
            const { language, skipLang } = req;
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Vehicle type fetched successfully',
                result: skipLang
                    ? vehicleType
                    : (0, vehicle_serialization_1.serializeVehicleDetail)(vehicleType, language),
            });
        }
        catch (error) {
            next(error);
        }
    }
    async createVehicleType(req, res, next) {
        try {
            const vehicleType = await vehicleDetailsService_1.default.createVehicleType(VehicleDetailController.modelName.vehicle_type, {
                ...req.body,
                file_path: req.file.path,
            });
            (0, response_1.default)(res, 201, {
                status: true,
                message: 'Vehicle type created successfully',
                result: vehicleType,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async updateVehicleType(req, res, next) {
        try {
            const vehicleType = await vehicleDetailsService_1.default.updateVehicleType(VehicleDetailController.modelName.vehicle_type, +req.params.id, {
                ...req.body,
                file_path: req.file ? req.file.path : undefined,
            });
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Vehicle type updated successfully',
                result: vehicleType,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async deleteVehicleType(req, res, next) {
        try {
            await vehicleDetailsService_1.default.deleteVehicleDetail(VehicleDetailController.modelName.vehicle_type, +req.params.id);
            (0, response_1.default)(res, 204, {
                status: true,
                message: 'Vehicle type deleted successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getVehicleNames(req, res, next) {
        try {
            const vehicleNames = await vehicleDetailsService_1.default.getVehicleDetails(VehicleDetailController.modelName.vehicle_name);
            const { language, skipLang } = req;
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Vehicle names fetched successfully',
                result: skipLang
                    ? vehicleNames
                    : (0, vehicle_serialization_1.serializeVehicleDetails)(vehicleNames, language),
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getVehicleNameById(req, res, next) {
        try {
            const vehicleName = await vehicleDetailsService_1.default.getVehicleDetailById(VehicleDetailController.modelName.vehicle_name, +req.params.id);
            const { language, skipLang } = req;
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Vehicle name fetched successfully',
                result: skipLang
                    ? vehicleName
                    : (0, vehicle_serialization_1.serializeVehicleDetail)(vehicleName, language),
            });
        }
        catch (error) {
            next(error);
        }
    }
    async createVehicleName(req, res, next) {
        try {
            const vehicleName = await vehicleDetailsService_1.default.createVehicleDetail(VehicleDetailController.modelName.vehicle_name, req.body);
            (0, response_1.default)(res, 201, {
                status: true,
                message: 'Vehicle name created successfully',
                result: vehicleName,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async updateVehicleName(req, res, next) {
        try {
            const vehicleName = await vehicleDetailsService_1.default.updateVehicleDetail(VehicleDetailController.modelName.vehicle_name, +req.params.id, req.body);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Vehicle name updated successfully',
                result: vehicleName,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async deleteVehicleName(req, res, next) {
        try {
            await vehicleDetailsService_1.default.deleteVehicleDetail(VehicleDetailController.modelName.vehicle_name, +req.params.id);
            (0, response_1.default)(res, 204, {
                status: true,
                message: 'Vehicle name deleted successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getAllVehicleDetails(req, res, next) {
        try {
            const vehicleDetail = await vehicleDetailsService_1.default.getAllVehicleDetails();
            const { language, skipLang } = req;
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Vehicle details fetched successfully',
                result: {
                    ...vehicleDetail,
                    vehicleColor: skipLang
                        ? vehicleDetail.vehicleColor
                        : (0, vehicle_serialization_1.serializeVehicleDetails)(vehicleDetail.vehicleColor, language),
                    vehicleClass: skipLang
                        ? vehicleDetail.vehicleClass
                        : (0, vehicle_serialization_1.serializeVehicleDetails)(vehicleDetail.vehicleClass, language),
                    vehicleTypes: skipLang
                        ? vehicleDetail.vehicleTypes
                        : (0, vehicle_serialization_1.serializeVehicleDetails)(vehicleDetail.vehicleTypes, language),
                    vehicleName: skipLang
                        ? vehicleDetail.vehicleName
                        : (0, vehicle_serialization_1.serializeVehicleDetails)(vehicleDetail.vehicleName, language),
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    async createVehicleProductionStartYear(req, res, next) {
        try {
            const vehicleProductionStartYear = await vehicleDetailsService_1.default.createVehicleProductionStartYear(req.body.start_year);
            (0, response_1.default)(res, 201, {
                status: true,
                message: 'Vehicle production start year created successfully',
                result: vehicleProductionStartYear,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getVehicleProductionStartYear(req, res, next) {
        try {
            const vehicleProductionStartYear = await vehicleDetailsService_1.default.getVehicleProductionStartYear();
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Vehicle production start year fetched successfully',
                result: vehicleProductionStartYear,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async updateVehicleProductionStartYear(req, res, next) {
        try {
            const vehicleProductionStartYear = await vehicleDetailsService_1.default.updateVehicleProductionStartYear(req.body.start_year);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Vehicle production start year updated successfully',
                result: vehicleProductionStartYear,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
VehicleDetailController.modelName = {
    vehicle_color: 'vehicle_Color',
    vehicle_class: 'vehicle_Class',
    vehicle_type: 'vehicle_Type',
    vehicle_name: 'vehicle_Name',
};
const vehicleDetailController = new VehicleDetailController();
exports.default = vehicleDetailController;
