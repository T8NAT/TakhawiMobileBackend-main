import Joi from 'joi';
import { CreateAppConfig } from '../types/appConfigTypr';

export const createAppConfigValidation = Joi.object<CreateAppConfig>().keys({
  key: Joi.string().required(),
  value: Joi.string().when('type', {
    is: 'IMAGE',
    then: Joi.optional(),
    otherwise: Joi.required(),
  }),
  type: Joi.string().valid('TEXT', 'IMAGE').optional(),
});

export const appConfigQueryValidation = Joi.object().keys({
  type: Joi.string().valid('TEXT', 'IMAGE').optional(),
});
