"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appConfigQueryValidation = exports.createAppConfigValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createAppConfigValidation = joi_1.default.object().keys({
    key: joi_1.default.string().required(),
    value: joi_1.default.string().when('type', {
        is: 'IMAGE',
        then: joi_1.default.optional(),
        otherwise: joi_1.default.required(),
    }),
    type: joi_1.default.string().valid('TEXT', 'IMAGE').optional(),
});
exports.appConfigQueryValidation = joi_1.default.object().keys({ type: joi_1.default.string().valid('TEXT', 'IMAGE').optional() });
