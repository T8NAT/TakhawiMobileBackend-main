import Joi from 'joi';
import { CreateWarningType } from '../types/warningType';
import { LocationType } from '../types/meetingLocationType';
import { Warning_en, Warning_ar } from '../enum/warning';

export const createWarningSchema = Joi.object<CreateWarningType>({
  ar_type: Joi.string()
    .valid(...Object.values(Warning_ar))
    .required(),
  en_type: Joi.string()
    .valid(...Object.values(Warning_en))
    .required(),
  location: Joi.object<LocationType>({
    lat: Joi.number().strict().required().messages({
      'number.base': 'lat must be a number',
      'any.required': 'lat is required',
    }),
    lng: Joi.number().strict().required().messages({
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

export const getWarningQuerySchema = Joi.object().keys({
  lat: Joi.number().required().messages({
    'number.base': 'lat must be a number',
    'any.required': 'lat is required',
  }),
  lng: Joi.number().required().messages({
    'number.base': 'lng must be a number',
    'any.required': 'lng is required',
  }),
});
