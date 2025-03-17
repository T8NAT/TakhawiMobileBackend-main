import Joi from 'joi';
import { CreateComplaint } from '../types/complaint';
export declare const createComplaintValidations: Joi.ObjectSchema<CreateComplaint>;
export declare const updateComplaintValidations: Joi.ObjectSchema<Partial<CreateComplaint>>;
