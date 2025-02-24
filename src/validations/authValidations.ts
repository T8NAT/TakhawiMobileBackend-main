import Joi from 'joi';
import { SignUpType, LoginType, ChangePasswordType } from '../types/authType';
import { Roles } from '../enum/roles';
import { Gneder } from '../enum/gender';

export const signUpValidationSchema = Joi.object<SignUpType>().keys({
  name: Joi.string().required().trim(),
  email: Joi.string().email().required(),
  password: Joi.string().min(5).required(),
  // .pattern(
  //   /^(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,}$/,
  //   'Password must be at least 8 characters long and include at least one letter and one symbol.'
  // ),
  role: Joi.string().valid(Roles.USER, Roles.DRIVER).required(),
  bio: Joi.string().optional().trim(),
  phone: Joi.string().required().min(9).max(9),
  birth_date: Joi.date().optional(),
  cityId: Joi.number().optional(),
  gender: Joi.string().valid(Gneder.MALE, Gneder.FEMALE).required(),
  national_id: Joi.string().optional().min(10).max(10),
});

export const loginValidationSchema = Joi.object<LoginType>().keys({
  phone: Joi.string().min(9).max(10).required(),
  password: Joi.string().required(),
});

export const checkPhoneExistValidationSchema = Joi.object().keys({
  phone: Joi.string().required().min(9).max(9),
});

export const checkEmailExistValidationSchema = Joi.object().keys({
  email: Joi.string().email().required(),
});

export const verifyResetCodeValidationSchema = Joi.object().keys({
  phone: Joi.string().required().min(9).max(9),
  code: Joi.string().required().min(1).max(6),
});

export const resetPasswordValidationSchema = Joi.object().keys({
  phone: Joi.string().required().min(9).max(9),
  password: Joi.string().min(5).required(),
});

export const changePasswordValidations = Joi.object<ChangePasswordType>().keys({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().min(5).max(5).required(),
});

export const verifyPhoneCodeSchema = Joi.object().keys({
  code: Joi.string().required().min(1).max(6),
});
