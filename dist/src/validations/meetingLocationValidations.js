"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMeetingLocationValidations = exports.createMeetingLocationValidations = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createMeetingLocationValidations = joi_1.default.object().keys({
    ar_name: joi_1.default.string().required(),
    en_name: joi_1.default.string().required(),
    cityId: joi_1.default.number().required(),
    location: joi_1.default.object({
        lat: joi_1.default.number().strict().required().messages({
            'number.base': 'lat must be a number',
            'any.required': 'lat is required'
        }),
        lng: joi_1.default.number().strict().required().messages({
            'number.base': 'lng must be a number',
            'any.required': 'lng is required'
        })
    }).required().messages({
        'object.base': 'Location must be an object',
        'any.required': 'Location is required'
    })
});
exports.updateMeetingLocationValidations = joi_1.default.object().keys({
    ar_name: joi_1.default.string().optional(),
    en_name: joi_1.default.string().optional(),
    cityId: joi_1.default.number().optional(),
    location: joi_1.default.object({
        lat: joi_1.default.number().strict().required().messages({
            'number.base': 'lat must be a number',
            'any.required': 'lat is required'
        }),
        lng: joi_1.default.number().strict().required().messages({
            'number.base': 'lng must be a number',
            'any.required': 'lng is required'
        })
    }).optional().messages({
        'object.base': 'Location must be an object',
        'any.required': 'Location is required'
    })
});
