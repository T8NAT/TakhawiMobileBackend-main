import Joi from 'joi';
import { CreateReason, UpdateReason } from '../types/reasonType';

export const createReasonValidation = Joi.object<CreateReason>().keys({
  ar_reason: Joi.string().required(),
  en_reason: Joi.string().required(),
});

export const updateReasonValidation = Joi.object<UpdateReason>().keys({
  ar_reason: Joi.string().optional(),
  en_reason: Joi.string().optional(),
});
