"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPhoneCodeSchema = exports.changePasswordValidations = exports.resetPasswordValidationSchema = exports.verifyResetCodeValidationSchema = exports.checkEmailExistValidationSchema = exports.checkPhoneExistValidationSchema = exports.loginValidationSchema = exports.signUpValidationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const roles_1 = require("../enum/roles");
const gender_1 = require("../enum/gender");
exports.signUpValidationSchema = joi_1.default.object().keys({
    name: joi_1.default.string().required().trim(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(5).required(),
    // .pattern(
    //   /^(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,}$/,
    //   'Password must be at least 8 characters long and include at least one letter and one symbol.'
    // ),
    role: joi_1.default.string().valid(roles_1.Roles.USER, roles_1.Roles.DRIVER).required(),
    bio: joi_1.default.string().optional().trim(),
    phone: joi_1.default.string().required().min(9).max(9),
    birth_date: joi_1.default.date().optional(),
    cityId: joi_1.default.number().optional(),
    gender: joi_1.default.string().valid(gender_1.Gneder.MALE, gender_1.Gneder.FEMALE).required(),
    national_id: joi_1.default.string().optional().min(10).max(10),
});
exports.loginValidationSchema = joi_1.default.object().keys({
    phone: joi_1.default.string().min(9).max(10).required(),
    password: joi_1.default.string().required(),
});
exports.checkPhoneExistValidationSchema = joi_1.default.object().keys({
    phone: joi_1.default.string().required().min(9).max(9),
});
exports.checkEmailExistValidationSchema = joi_1.default.object().keys({
    email: joi_1.default.string().email().required(),
});
exports.verifyResetCodeValidationSchema = joi_1.default.object().keys({
    phone: joi_1.default.string().required().min(9).max(9),
    code: joi_1.default.string().required().min(1).max(6),
});
exports.resetPasswordValidationSchema = joi_1.default.object().keys({
    phone: joi_1.default.string().required().min(9).max(9),
    password: joi_1.default.string().min(5).required(),
});
exports.changePasswordValidations = joi_1.default.object().keys({
    oldPassword: joi_1.default.string().required(),
    newPassword: joi_1.default.string().min(5).max(5).required(),
});
exports.verifyPhoneCodeSchema = joi_1.default.object().keys({
    code: joi_1.default.string().required().min(1).max(6),
});
