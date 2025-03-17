import Joi from 'joi';
import { CreateUser, Location, UserQueryType } from '../types/userType';
export declare const createUserValidation: Joi.ObjectSchema<CreateUser>;
export declare const updateUserValidation: Joi.ObjectSchema<Partial<CreateUser>>;
export declare const updateLocationSchema: Joi.ObjectSchema<Location>;
export declare const updateUserStatusSchema: Joi.ObjectSchema<any>;
export declare const userQueryTypeSchema: Joi.ObjectSchema<UserQueryType>;
export declare const fcmtokenSchema: Joi.ObjectSchema<any>;
