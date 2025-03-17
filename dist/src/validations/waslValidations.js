"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTripRegistrationSchema = exports.createDriverandVehicleRegistrationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createDriverandVehicleRegistrationSchema = joi_1.default.object().keys({
    userId: joi_1.default.number().optional(),
});
exports.createTripRegistrationSchema = joi_1.default.object().keys({
    sequenceNumber: joi_1.default.string().required(),
    driverId: joi_1.default.string().required(),
    tripId: joi_1.default.number().strict().required(),
    distanceInMeters: joi_1.default.number().strict().required(),
    durationInSeconds: joi_1.default.number().strict().required(),
    customerRating: joi_1.default.number().strict().required(),
    customerWaitingTimeInSeconds: joi_1.default.number().strict().required(),
    originLatitude: joi_1.default.number().strict().required(),
    originLongitude: joi_1.default.number().strict().required(),
    destinationLatitude: joi_1.default.number().strict().required(),
    destinationLongitude: joi_1.default.number().strict().required(),
    pickupTimestamp: joi_1.default.date().iso().required(),
    dropoffTimestamp: joi_1.default.date().iso().required(),
    startedWhen: joi_1.default.date().iso().required(),
    tripCost: joi_1.default.number().strict().required(),
});
