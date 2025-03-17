"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateTripPriceValidation = exports.basicTripQueryTypeValidation = exports.CancelPassengerTripValidation = exports.CancelBasicTripValidation = exports.joinBasicTripValidation = exports.createBasicTripValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const moment_1 = __importDefault(require("moment"));
const payment_1 = require("../enum/payment");
const features_1 = require("../enum/features");
const trip_1 = require("../enum/trip");
exports.createBasicTripValidation = joi_1.default.object().keys({
    start_date: joi_1.default.date()
        .iso()
        .min((0, moment_1.default)().add(1, 'h').toDate())
        .required()
        .messages({
        'date.base': 'Start date must be an iso date.',
        'date.min': 'Start date must be after the current date.',
        'any.required': 'Start date is required.',
    }),
    end_date: joi_1.default.date().iso().min(joi_1.default.ref('start_date')).required()
        .messages({
        'date.base': 'End date must be an iso date.',
        'date.min': 'End date must be after the start date.',
        'any.required': 'End date is required.',
    }),
    seats_no: joi_1.default.number().min(1).max(7).required(),
    available_seats_no: joi_1.default.number().default(joi_1.default.ref('seats_no')),
    price_per_seat: joi_1.default.number().min(1).required(),
    destination_id: joi_1.default.number().strict().required(),
    pickup_location_id: joi_1.default.number().strict().required(),
    distance: joi_1.default.number().strict().optional(),
    features: joi_1.default.array()
        .items(joi_1.default.string().valid(...Object.values(features_1.Features)))
        .required()
        .messages({
        'array.base': 'Features must be an array.',
        'any.required': 'Features is required.',
        'any.only': `Features must be one of: ${Object.values(features_1.Features).join(', ')}.`,
    }),
});
exports.joinBasicTripValidation = joi_1.default.object().keys({
    payment_method: joi_1.default.string()
        .valid(...Object.values(payment_1.PaymentMethod))
        .required(),
    trip_id: joi_1.default.number().strict().required(),
    coupon: joi_1.default.string().optional(),
    card_id: joi_1.default.when('payment_method', {
        is: payment_1.PaymentMethod.CARD,
        then: joi_1.default.number().strict().required(),
        otherwise: joi_1.default.forbidden(),
    }),
});
exports.CancelBasicTripValidation = joi_1.default.object().keys({
    note: joi_1.default.string().optional(),
    reason: joi_1.default.string()
        .valid(...Object.values(trip_1.TripCancelationReason))
        .required(),
});
exports.CancelPassengerTripValidation = joi_1.default.object().keys({
    note: joi_1.default.string().optional(),
    reason: joi_1.default.string()
        .valid(...Object.values(trip_1.TripCancelationReason))
        .required(),
    trip_id: joi_1.default.number().strict().required(),
});
exports.basicTripQueryTypeValidation = joi_1.default.object().keys({
    cityPickupId: joi_1.default.number().required(),
    destinationLat: joi_1.default.number().required(),
    destinationLng: joi_1.default.number().required(),
    startDate: joi_1.default.date().iso().required(),
    sortBy: joi_1.default.string().valid(...Object.values(trip_1.TripSorting)),
    limit: joi_1.default.number().optional(),
    page: joi_1.default.number().optional(),
});
exports.calculateTripPriceValidation = joi_1.default.object().keys({
    coupon: joi_1.default.string().optional(),
});
