"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateHobbyValidations = exports.createHobbyValidations = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createHobbyValidations = joi_1.default.object().keys({
    ar_name: joi_1.default.string().required(),
    en_name: joi_1.default.string().required(),
});
exports.updateHobbyValidations = joi_1.default.object().keys({
    ar_name: joi_1.default.string().optional(),
    en_name: joi_1.default.string().optional(),
});
