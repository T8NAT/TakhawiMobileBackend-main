"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeVehicles = exports.serializeVehicle = exports.serializeVehicleDetails = exports.serializeVehicleDetail = void 0;
const serializeVehicleDetail = (detail, lang) => {
    const { ar_name: arName, en_name: enName, ...rest } = detail;
    return {
        ...rest,
        name: detail[`${lang}_name`],
    };
};
exports.serializeVehicleDetail = serializeVehicleDetail;
const serializeVehicleDetails = (details, lang) => details.map((detail) => (0, exports.serializeVehicleDetail)(detail, lang));
exports.serializeVehicleDetails = serializeVehicleDetails;
const serializeVehicle = (vehicle, lang) => ({
    ...vehicle,
    Vehicle_Color: vehicle.Vehicle_Color
        ? (0, exports.serializeVehicleDetail)(vehicle.Vehicle_Color, lang)
        : undefined,
    Vehicle_Class: vehicle.Vehicle_Class
        ? (0, exports.serializeVehicleDetail)(vehicle.Vehicle_Class, lang)
        : undefined,
    Vehicle_Type: vehicle.Vehicle_Type
        ? (0, exports.serializeVehicleDetail)(vehicle.Vehicle_Type, lang)
        : undefined,
    Vehicle_Name: vehicle.Vehicle_Name
        ? (0, exports.serializeVehicleDetail)(vehicle.Vehicle_Name, lang)
        : undefined,
});
exports.serializeVehicle = serializeVehicle;
const serializeVehicles = (vehicles, lang) => vehicles.map((vehicle) => (0, exports.serializeVehicle)(vehicle, lang));
exports.serializeVehicles = serializeVehicles;
