import Joi from 'joi';
import { Location } from '../types/userType';

export const uploadNationalIDValidation = Joi.object().keys({
  national_id: Joi.string().required(),
});

export const nearstDriversSchema = Joi.object<Location>().keys({
  lat: Joi.number().required(),
  lng: Joi.number().required(),
});
