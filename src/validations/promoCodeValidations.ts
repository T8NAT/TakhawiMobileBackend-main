import Joi from 'joi';
import { CreatePromoCode, UpdatePromoCode } from '../types/promoCodeType';
import { PromoCodeType } from '../enum/promoCode';

export const createPromoCodeValidations = Joi.object<CreatePromoCode>().keys({
  code: Joi.string().required().messages({
    'string.base': 'Code must be a string.',
    'any.required': 'Code is required.',
  }),
  from: Joi.date().required().messages({
    'date.base': 'From must be a date.',
    'any.required': 'From is required.',
  }),
  to: Joi.date().min(Joi.ref('from')).required().messages({
    'date.base': 'To must be a date.',
    'date.min': 'To must be after from.',
    'any.required': 'To is required.',
  }),
  type: Joi.string()
    .valid(...Object.values(PromoCodeType))
    .required()
    .messages({
      'string.base': 'Type must be a string.',
      'any.only': `Type must be one of: ${Object.values(PromoCodeType)}.`,
      'any.required': 'Type is required.',
    }),
  is_active: Joi.boolean().optional().messages({
    'boolean.base': 'Is active must be a boolean.',
  }),
  amount: Joi.when('type', {
    is: PromoCodeType.PERCENTAGE,
    then: Joi.number().strict().min(1).max(100),
    otherwise: Joi.number().strict().min(1),
  })
    .required()
    .messages({
      'number.base': 'Amount must be a number.',
      'number.min': 'Amount must be at least 1.',
      'number.max': `Amount must be at most 100 in case of ${PromoCodeType.PERCENTAGE}.`,
      'any.required': 'Amount is required.',
    }),
  max_discount: Joi.number().strict().min(1).allow(null).optional().messages({
    'number.base': 'Max discount must be a number.',
    'number.min': 'Max discount must be at least 1.',
  }),
  limit: Joi.number().strict().min(1).required().messages({
    'number.base': 'Limit must be a number.',
    'any.required': 'Limit is required.',
    'number.min': 'Limit must be at least 1.',
  }),
  userId: Joi.number().strict().allow(null).optional().messages({
    'number.base': 'User ID must be a number.',
  }),
});

export const updatePromoCodeValidations = Joi.object<UpdatePromoCode>().keys({
  code: Joi.string().optional().messages({
    'string.base': 'Code must be a string.',
  }),
  from: Joi.date().optional().messages({
    'date.base': 'From date must be a valid date.',
  }),
  to: Joi.date().optional().messages({
    'date.base': 'To date must be a valid date.',
  }),
  type: Joi.string()
    .valid(...Object.values(PromoCodeType))
    .optional()
    .messages({
      'string.base': 'Type must be a string.',
      'any.only': `Type must be one of: ${Object.values(PromoCodeType).join(', ')}.`,
    }),
  is_active: Joi.boolean().optional().messages({
    'boolean.base': 'Is active must be a boolean.',
  }),
  amount: Joi.number().strict().min(1).optional().messages({
    'number.base': 'Amount must be a number.',
    'number.min': 'Amount must be at least 1.',
  }),
  max_discount: Joi.number().strict().min(1).allow(null).optional().messages({
    'number.base': 'Max discount must be a number.',
    'number.min': 'Max discount must be at least 1.',
  }),
  limit: Joi.number().strict().min(1).optional().messages({
    'number.base': 'Limit must be a number.',
    'number.min': 'Limit must be at least 1.',
  }),
  userId: Joi.number().strict().allow(null).optional().messages({
    'number.base': 'User ID must be a number.',
  }),
});
