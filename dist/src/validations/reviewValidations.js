"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewTypeQueryValidation = exports.createReviewValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const roles_1 = require("../enum/roles");
exports.createReviewValidation = joi_1.default.object().keys({
    trip_id: joi_1.default.number().strict().required(),
    target_id: joi_1.default.number().strict().required(),
    rate: joi_1.default.number().min(1).max(5).required(),
    note: joi_1.default.string().optional(),
});
exports.reviewTypeQueryValidation = joi_1.default.object().keys({
    page: joi_1.default.number().min(1).optional(),
    limit: joi_1.default.number().min(1).optional(),
    target_id: joi_1.default.number().optional(),
    type: joi_1.default.string().valid(roles_1.Roles.DRIVER, roles_1.Roles.USER).optional(),
    trip_id: joi_1.default.number().optional(),
});
