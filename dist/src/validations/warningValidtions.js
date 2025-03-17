"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWarningQuerySchema = exports.createWarningSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const warning_1 = require("../enum/warning");
exports.createWarningSchema = joi_1.default.object({
    ar_type: joi_1.default.string()
        .valid(...Object.values(warning_1.Warning_ar))
        .required(),
    en_type: joi_1.default.string()
        .valid(...Object.values(warning_1.Warning_en))
        .required(),
    location: joi_1.default.object({
        lat: joi_1.default.number().strict().required().messages({
            'number.base': 'lat must be a number',
            'any.required': 'lat is required',
        }),
        lng: joi_1.default.number().strict().required().messages({
            'number.base': 'lng must be a number',
            'any.required': 'lng is required',
        }),
    })
        .required()
        .messages({
        'object.base': 'Location must be an object',
        'any.required': 'Location is required',
    }),
});
exports.getWarningQuerySchema = joi_1.default.object().keys({
    lat: joi_1.default.number().required().messages({
        'number.base': 'lat must be a number',
        'any.required': 'lat is required',
    }),
    lng: joi_1.default.number().required().messages({
        'number.base': 'lng must be a number',
        'any.required': 'lng is required',
    }),
});
