import Joi from 'joi';
import { CreateHobby } from '../types/hobbyType';
export declare const createHobbyValidations: Joi.ObjectSchema<CreateHobby>;
export declare const updateHobbyValidations: Joi.ObjectSchema<Partial<CreateHobby>>;
