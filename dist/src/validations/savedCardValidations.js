"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserBillingInfoValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createUserBillingInfoValidation = joi_1.default.object().keys({
    cityId: joi_1.default.number().strict().required(),
    state: joi_1.default.string().required(),
    street: joi_1.default.string().required(),
    surname: joi_1.default.string().required(),
});
