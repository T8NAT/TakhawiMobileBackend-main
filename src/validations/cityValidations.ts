import Joi from 'joi';
import { CreateCity, UpdateCity } from '../types/cityType';

export const createCityValidations = Joi.object<CreateCity>().keys({
  ar_name: Joi.string().required(),
  en_name: Joi.string().required(),
  postcode: Joi.string().required(),
});

export const updateCityValidations = Joi.object<UpdateCity>().keys({
  ar_name: Joi.string().optional(),
  en_name: Joi.string().optional(),
  postcode: Joi.string().optional(),
});
