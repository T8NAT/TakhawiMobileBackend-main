"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.noOfMonthValidation = exports.getNearByVipTripsByDistanceSchema = exports.nearByVipTripsSchema = exports.updateTripStatusSchema = exports.tripQueryTypeValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const trip_1 = require("../enum/trip");
exports.tripQueryTypeValidation = joi_1.default.object().keys({
    from: joi_1.default.date().iso(),
    to: joi_1.default.date().iso(),
    type: joi_1.default.string().valid(...Object.values(trip_1.TripType)),
    status: joi_1.default.string().valid(...Object.values(trip_1.TripStatus)),
    limit: joi_1.default.number(),
    page: joi_1.default.number(),
});
exports.updateTripStatusSchema = joi_1.default.object().keys({
    status: joi_1.default.string()
        .valid(trip_1.TripStatus.ON_WAY, trip_1.TripStatus.ARRIVED, trip_1.TripStatus.INPROGRESS)
        .required(),
});
exports.nearByVipTripsSchema = joi_1.default.object().keys({
    lat: joi_1.default.number().required(),
    lng: joi_1.default.number().required(),
});
exports.getNearByVipTripsByDistanceSchema = joi_1.default.object().keys({
    distance: joi_1.default.number().required(),
});
exports.noOfMonthValidation = joi_1.default.object().keys({
    noOfMonth: joi_1.default.number().min(1).max(12).required(),
});
