import Joi from 'joi';
import {
  CreateMeetingLocation,
  LocationType,
  UpdateMeetingLocation,
} from '../types/meetingLocationType';

export const createMeetingLocationValidations =
  Joi.object<CreateMeetingLocation>().keys({
    ar_name: Joi.string().required(),
    en_name: Joi.string().required(),
    cityId: Joi.number().required(),
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

export const updateMeetingLocationValidations =
  Joi.object<UpdateMeetingLocation>().keys({
    ar_name: Joi.string().optional(),
    en_name: Joi.string().optional(),
    cityId: Joi.number().optional(),
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
      .optional()
      .messages({
        'object.base': 'Location must be an object',
        'any.required': 'Location is required',
      }),
  });
