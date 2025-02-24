import Joi from 'joi';
import {
  CreateUser,
  Location,
  UpdateUser,
  UserQueryType,
} from '../types/userType';
import { Gneder } from '../enum/gender';
import { Roles } from '../enum/roles';
import { Languages } from '../enum/languages';
import { UserActivityStatus, UserStatus } from '../enum/userStatus';
import { waslRegistrationStatus } from '../enum/wasl';

export const createUserValidation = Joi.object<CreateUser>().keys({
  name: Joi.string().required(),
  phone: Joi.string().required().min(9).max(9),
  email: Joi.string().email().required(),
  password: Joi.string().min(5).required(),
  role: Joi.string()
    .valid(...Object.values(Roles))
    .optional(),
  birth_date: Joi.date().iso().optional(),
  bio: Joi.string().allow(null).optional(),
  national_id: Joi.string().min(10).max(10).required(),
  cityId: Joi.number().optional(),
  gender: Joi.string()
    .valid(...Object.values(Gneder))
    .required(),
  hobbies: Joi.array().min(1).items(Joi.number()).optional(),
  prefered_language: Joi.string()
    .valid(...Object.values(Languages))
    .optional(),
});

export const updateUserValidation = Joi.object<UpdateUser>().keys({
  name: Joi.string(),
  phone: Joi.string().min(9).max(9),
  email: Joi.string().email(),
  birth_date: Joi.date().iso(),
  bio: Joi.string().allow(null),
  national_id: Joi.string().min(10).max(10),
  cityId: Joi.number(),
  gender: Joi.string().valid(...Object.values(Gneder)),
  hobbies: Joi.array().min(1).items(Joi.number()).optional(),
  prefered_language: Joi.string().valid(...Object.values(Languages)),
});

export const updateLocationSchema = Joi.object<Location>().keys({
  lat: Joi.number().strict().required(),
  lng: Joi.number().strict().required(),
});

export const updateUserStatusSchema = Joi.object().keys({
  status: Joi.string()
    .valid(...Object.values(UserStatus))
    .required(),
});

export const userQueryTypeSchema = Joi.object<UserQueryType>().keys({
  role: Joi.string()
    .valid(...Object.values(Roles))
    .optional(),
  passenger_status: Joi.string()
    .valid(...Object.values(UserStatus))
    .optional(),
  driver_status: Joi.string()
    .valid(...Object.values(UserStatus))
    .optional(),
  user_activity_status: Joi.string()
    .valid(...Object.values(UserActivityStatus))
    .optional(),
  wasl_registration_status: Joi.string()
    .valid(...Object.values(waslRegistrationStatus))
    .optional(),
  limit: Joi.number().optional(),
  page: Joi.number().optional(),
});

export const fcmtokenSchema = Joi.object().keys({
  token: Joi.string().required(),
});
