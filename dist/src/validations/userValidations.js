"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fcmtokenSchema = exports.userQueryTypeSchema = exports.updateUserStatusSchema = exports.updateLocationSchema = exports.updateUserValidation = exports.createUserValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const gender_1 = require("../enum/gender");
const roles_1 = require("../enum/roles");
const languages_1 = require("../enum/languages");
const userStatus_1 = require("../enum/userStatus");
const wasl_1 = require("../enum/wasl");
exports.createUserValidation = joi_1.default.object().keys({
    name: joi_1.default.string().required(),
    phone: joi_1.default.string().required().min(9).max(9),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(5).required(),
    role: joi_1.default.string().valid(...Object.values(roles_1.Roles)).optional(),
    birth_date: joi_1.default.date().iso().optional(),
    bio: joi_1.default.string().allow(null).optional(),
    national_id: joi_1.default.string().min(10).max(10).required(),
    cityId: joi_1.default.number().optional(),
    gender: joi_1.default.string().valid(...Object.values(gender_1.Gneder)).required(),
    hobbies: joi_1.default.array().min(1).items(joi_1.default.number()).optional(),
    prefered_language: joi_1.default.string().valid(...Object.values(languages_1.Languages)).optional(),
});
exports.updateUserValidation = joi_1.default.object().keys({
    name: joi_1.default.string(),
    phone: joi_1.default.string().min(9).max(9),
    email: joi_1.default.string().email(),
    birth_date: joi_1.default.date().iso(),
    bio: joi_1.default.string().allow(null),
    national_id: joi_1.default.string().min(10).max(10),
    cityId: joi_1.default.number(),
    gender: joi_1.default.string().valid(...Object.values(gender_1.Gneder)),
    hobbies: joi_1.default.array().min(1).items(joi_1.default.number()).optional(),
    prefered_language: joi_1.default.string().valid(...Object.values(languages_1.Languages)),
});
exports.updateLocationSchema = joi_1.default.object().keys({
    lat: joi_1.default.number().strict().required(),
    lng: joi_1.default.number().strict().required(),
});
exports.updateUserStatusSchema = joi_1.default.object().keys({ status: joi_1.default.string().valid(...Object.values(userStatus_1.UserStatus)).required() });
exports.userQueryTypeSchema = joi_1.default.object().keys({
    role: joi_1.default.string().valid(...Object.values(roles_1.Roles)).optional(),
    passenger_status: joi_1.default.string().valid(...Object.values(userStatus_1.UserStatus)).optional(),
    driver_status: joi_1.default.string().valid(...Object.values(userStatus_1.UserStatus)).optional(),
    user_activity_status: joi_1.default.string().valid(...Object.values(userStatus_1.UserActivityStatus)).optional(),
    wasl_registration_status: joi_1.default.string().valid(...Object.values(wasl_1.waslRegistrationStatus)).optional(),
    limit: joi_1.default.number().optional(),
    page: joi_1.default.number().optional(),
});
exports.fcmtokenSchema = joi_1.default.object().keys({
    token: joi_1.default.string().required(),
});
