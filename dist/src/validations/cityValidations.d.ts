import Joi from 'joi';
import { CreateCity } from '../types/cityType';
export declare const createCityValidations: Joi.ObjectSchema<CreateCity>;
export declare const updateCityValidations: Joi.ObjectSchema<Partial<CreateCity>>;
