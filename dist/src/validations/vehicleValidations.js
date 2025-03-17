"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleQueryTypeValidation = exports.updateVehicleValidation = exports.createVehicleValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createVehicleValidation = joi_1.default.object().keys({
    serial_no: joi_1.default.string().required(),
    plate_alphabet: joi_1.default.string().min(1).max(3).required(),
    plate_alphabet_ar: joi_1.default.string().min(1).required(),
    plate_number: joi_1.default.string().min(1).max(4).required(),
    seats_no: joi_1.default.number().min(1).max(7)
        .required(),
    production_year: joi_1.default.number().min(1950).required(),
    vehicle_class_id: joi_1.default.number().required(),
    vehicle_color_id: joi_1.default.number().required(),
    vehicle_type_id: joi_1.default.number().required(),
    vehicle_name_id: joi_1.default.number().required(),
});
exports.updateVehicleValidation = joi_1.default.object().keys({
    serial_no: joi_1.default.string().optional(),
    plate_alphabet: joi_1.default.string().min(1).max(3).optional(),
    plate_alphabet_ar: joi_1.default.string().min(1).optional(),
    plate_number: joi_1.default.string().min(1).max(4).optional(),
    seats_no: joi_1.default.number().min(1).max(7).optional(),
    production_year: joi_1.default.number().min(1950).optional(),
    vehicle_class_id: joi_1.default.number().optional(),
    vehicle_color_id: joi_1.default.number().optional(),
    vehicle_type_id: joi_1.default.number().optional(),
    vehicle_name_id: joi_1.default.number().optional(),
});
exports.VehicleQueryTypeValidation = joi_1.default.object().keys({
    page: joi_1.default.number().optional(),
    limit: joi_1.default.number().optional(),
    production_year: joi_1.default.number().optional(),
    seats_no: joi_1.default.number().optional(),
});
