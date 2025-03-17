"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReasonValidation = exports.createReasonValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createReasonValidation = joi_1.default.object().keys({
    ar_reason: joi_1.default.string().required(),
    en_reason: joi_1.default.string().required(),
});
exports.updateReasonValidation = joi_1.default.object().keys({
    ar_reason: joi_1.default.string().optional(),
    en_reason: joi_1.default.string().optional(),
});
