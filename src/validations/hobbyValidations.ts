import Joi from 'joi';
import { CreateHobby, UpdateHobby } from '../types/hobbyType';

export const createHobbyValidations = Joi.object<CreateHobby>().keys({
  ar_name: Joi.string().required(),
  en_name: Joi.string().required(),
});

export const updateHobbyValidations = Joi.object<UpdateHobby>().keys({
  ar_name: Joi.string().optional(),
  en_name: Joi.string().optional(),
});
