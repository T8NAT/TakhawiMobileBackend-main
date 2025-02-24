import Joi from 'joi';
import { CreateAddress, UpdateAddress } from '../types/address';

export const createAddressValidation = Joi.object<CreateAddress>().keys({
  lat: Joi.number().required(),
  lng: Joi.number().required(),
  alias: Joi.string().required(),
  description: Joi.string().optional(),
  is_favorite: Joi.boolean().optional(),
});

export const updateAddressValidation = Joi.object<UpdateAddress>().keys({
  lat: Joi.number().optional(),
  lng: Joi.number().optional(),
  alias: Joi.string().optional(),
  description: Joi.string().optional(),
  is_favorite: Joi.boolean().optional(),
});
