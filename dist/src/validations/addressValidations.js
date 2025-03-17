"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAddressValidation = exports.createAddressValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createAddressValidation = joi_1.default.object().keys({
    lat: joi_1.default.number().required(),
    lng: joi_1.default.number().required(),
    alias: joi_1.default.string().required(),
    description: joi_1.default.string().optional(),
    is_favorite: joi_1.default.boolean().optional(),
});
exports.updateAddressValidation = joi_1.default.object().keys({
    lat: joi_1.default.number().optional(),
    lng: joi_1.default.number().optional(),
    alias: joi_1.default.string().optional(),
    description: joi_1.default.string().optional(),
    is_favorite: joi_1.default.boolean().optional(),
});
