"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applepaySessionValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.applepaySessionValidation = joi_1.default.object().keys({
    type: joi_1.default.string().valid('offer', 'basic-trip').required(),
    checkoutId: joi_1.default.string().required(),
});
