import Joi from 'joi';
import { CreateRecentAddress } from '../types/recentAddressType';

export const createRecentAddressSchema = Joi.object<CreateRecentAddress>().keys(
  {
    lat: Joi.number().strict().required(),
    lng: Joi.number().strict().required(),
    alias: Joi.string().optional(),
    description: Joi.string().optional(),
  },
);
