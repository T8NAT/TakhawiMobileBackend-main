"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCityValidations = exports.createCityValidations = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createCityValidations = joi_1.default.object().keys({
    ar_name: joi_1.default.string().required(),
    en_name: joi_1.default.string().required(),
    postcode: joi_1.default.string().required(),
});
exports.updateCityValidations = joi_1.default.object().keys({
    ar_name: joi_1.default.string().optional(),
    en_name: joi_1.default.string().optional(),
    postcode: joi_1.default.string().optional(),
});
