import Joi from 'joi';
import { CreatePromoCode } from '../types/promoCodeType';
export declare const createPromoCodeValidations: Joi.ObjectSchema<CreatePromoCode>;
export declare const updatePromoCodeValidations: Joi.ObjectSchema<Partial<CreatePromoCode>>;
