import Joi from 'joi';
import { CreateAddress } from '../types/address';
export declare const createAddressValidation: Joi.ObjectSchema<CreateAddress>;
export declare const updateAddressValidation: Joi.ObjectSchema<Partial<CreateAddress>>;
