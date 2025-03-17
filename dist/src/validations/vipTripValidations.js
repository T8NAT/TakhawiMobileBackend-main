"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelTripSchema = exports.acceptOfferSchema = exports.createOfferSchema = exports.createVipTripSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const payment_1 = require("../enum/payment");
const features_1 = require("../enum/features");
const trip_1 = require("../enum/trip");
exports.createVipTripSchema = joi_1.default.object().keys({
    start_date: joi_1.default.date().iso().required(),
    destination_location_lat: joi_1.default.number().strict().required(),
    destination_location_lng: joi_1.default.number().strict().required(),
    pickup_description: joi_1.default.string().required(),
    pickup_location_lat: joi_1.default.number().strict().required(),
    pickup_location_lng: joi_1.default.number().strict().required(),
    destination_description: joi_1.default.string().required(),
    distance: joi_1.default.number().strict().optional(),
    features: joi_1.default.array()
        .items(joi_1.default.string().valid(...Object.values(features_1.Features)))
        .required(),
});
exports.createOfferSchema = joi_1.default.object().keys({
    price: joi_1.default.number().strict().required(),
    features: joi_1.default.array()
        .items(joi_1.default.string().valid(...Object.values(features_1.Features)))
        .required(),
});
exports.acceptOfferSchema = joi_1.default.object().keys({
    payment_method: joi_1.default.string()
        .valid(...Object.values(payment_1.PaymentMethod))
        .required(),
    coupon: joi_1.default.string().optional(),
    card_id: joi_1.default.when('payment_method', {
        is: payment_1.PaymentMethod.CARD,
        then: joi_1.default.number().strict().required(),
        otherwise: joi_1.default.forbidden(),
    }),
});
exports.cancelTripSchema = joi_1.default.object().keys({
    reason: joi_1.default.string()
        .valid(...Object.values(trip_1.TripCancelationReason))
        .required(),
    note: joi_1.default.string().optional(),
});
