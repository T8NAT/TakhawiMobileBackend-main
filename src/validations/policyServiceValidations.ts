import Joi from 'joi';
import {
  CreatePolicyService,
  UpdatePolicyService,
} from '../types/policyServiceType';

export const createPolicyServiceValidation =
  Joi.object<CreatePolicyService>().keys({
    ar_content: Joi.string().required(),
    en_content: Joi.string().required(),
  });

export const updatePolicyServiceValidation =
  Joi.object<UpdatePolicyService>().keys({
    ar_content: Joi.string(),
    en_content: Joi.string(),
  });
