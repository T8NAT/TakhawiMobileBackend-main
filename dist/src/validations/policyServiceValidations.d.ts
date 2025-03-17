import Joi from 'joi';
import { CreatePolicyService } from '../types/policyServiceType';
export declare const createPolicyServiceValidation: Joi.ObjectSchema<CreatePolicyService>;
export declare const updatePolicyServiceValidation: Joi.ObjectSchema<Partial<CreatePolicyService>>;
