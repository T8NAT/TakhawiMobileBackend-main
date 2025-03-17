"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePolicyServiceValidation = exports.createPolicyServiceValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createPolicyServiceValidation = joi_1.default.object().keys({
    ar_content: joi_1.default.string().required(),
    en_content: joi_1.default.string().required(),
});
exports.updatePolicyServiceValidation = joi_1.default.object().keys({
    ar_content: joi_1.default.string(),
    en_content: joi_1.default.string(),
});
