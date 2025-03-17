"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePromoCodeValidations = exports.createPromoCodeValidations = void 0;
const joi_1 = __importDefault(require("joi"));
const promoCode_1 = require("../enum/promoCode");
exports.createPromoCodeValidations = joi_1.default.object().keys({
    code: joi_1.default.string().required().messages({
        'string.base': 'Code must be a string.',
        'any.required': 'Code is required.',
    }),
    from: joi_1.default.date().required().messages({
        'date.base': 'From must be a date.',
        'any.required': 'From is required.',
    }),
    to: joi_1.default.date().min(joi_1.default.ref('from')).required().messages({
        'date.base': 'To must be a date.',
        'date.min': 'To must be after from.',
        'any.required': 'To is required.',
    }),
    type: joi_1.default.string()
        .valid(...Object.values(promoCode_1.PromoCodeType))
        .required()
        .messages({
        'string.base': 'Type must be a string.',
        'any.only': `Type must be one of: ${Object.values(promoCode_1.PromoCodeType)}.`,
        'any.required': 'Type is required.',
    }),
    is_active: joi_1.default.boolean().optional().messages({
        'boolean.base': 'Is active must be a boolean.',
    }),
    amount: joi_1.default.when('type', {
        is: promoCode_1.PromoCodeType.PERCENTAGE,
        then: joi_1.default.number().strict().min(1).max(100),
        otherwise: joi_1.default.number().strict().min(1),
    }).required()
        .messages({
        'number.base': 'Amount must be a number.',
        'number.min': 'Amount must be at least 1.',
        'number.max': `Amount must be at most 100 in case of ${promoCode_1.PromoCodeType.PERCENTAGE}.`,
        'any.required': 'Amount is required.',
    }),
    max_discount: joi_1.default.number().strict().min(1).allow(null)
        .optional()
        .messages({
        'number.base': 'Max discount must be a number.',
        'number.min': 'Max discount must be at least 1.',
    }),
    limit: joi_1.default.number().strict().min(1).required()
        .messages({
        'number.base': 'Limit must be a number.',
        'any.required': 'Limit is required.',
        'number.min': 'Limit must be at least 1.',
    }),
    userId: joi_1.default.number().strict().allow(null).optional()
        .messages({
        'number.base': 'User ID must be a number.',
    }),
});
exports.updatePromoCodeValidations = joi_1.default.object().keys({
    code: joi_1.default.string().optional().messages({
        'string.base': 'Code must be a string.',
    }),
    from: joi_1.default.date().optional().messages({
        'date.base': 'From date must be a valid date.',
    }),
    to: joi_1.default.date().optional().messages({
        'date.base': 'To date must be a valid date.',
    }),
    type: joi_1.default.string()
        .valid(...Object.values(promoCode_1.PromoCodeType))
        .optional()
        .messages({
        'string.base': 'Type must be a string.',
        'any.only': `Type must be one of: ${Object.values(promoCode_1.PromoCodeType).join(', ')}.`,
    }),
    is_active: joi_1.default.boolean().optional().messages({
        'boolean.base': 'Is active must be a boolean.',
    }),
    amount: joi_1.default.number().strict().min(1).optional()
        .messages({
        'number.base': 'Amount must be a number.',
        'number.min': 'Amount must be at least 1.',
    }),
    max_discount: joi_1.default.number().strict().min(1).allow(null)
        .optional()
        .messages({
        'number.base': 'Max discount must be a number.',
        'number.min': 'Max discount must be at least 1.',
    }),
    limit: joi_1.default.number().strict().min(1).optional()
        .messages({
        'number.base': 'Limit must be a number.',
        'number.min': 'Limit must be at least 1.',
    }),
    userId: joi_1.default.number().strict().allow(null).optional()
        .messages({
        'number.base': 'User ID must be a number.',
    }),
});
