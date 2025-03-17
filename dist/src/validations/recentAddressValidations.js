"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRecentAddressSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createRecentAddressSchema = joi_1.default.object().keys({
    lat: joi_1.default.number().strict().required(),
    lng: joi_1.default.number().strict().required(),
    alias: joi_1.default.string().optional(),
    description: joi_1.default.string().optional(),
});
