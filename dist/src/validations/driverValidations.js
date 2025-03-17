"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nearstDriversSchema = exports.uploadNationalIDValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.uploadNationalIDValidation = joi_1.default.object().keys({
    national_id: joi_1.default.string().required(),
});
exports.nearstDriversSchema = joi_1.default.object().keys({
    lat: joi_1.default.number().required(),
    lng: joi_1.default.number().required(),
});
