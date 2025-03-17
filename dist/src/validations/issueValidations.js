"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.issueTypeQueryValidation = exports.updateIssueValidation = exports.createIssueValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createIssueValidation = joi_1.default.object().keys({
    note: joi_1.default.string().optional(),
    reasonId: joi_1.default.number().strict().required(),
    tripId: joi_1.default.number().strict().required(),
});
exports.updateIssueValidation = joi_1.default.object().keys({
    note: joi_1.default.string().optional(),
    reasonId: joi_1.default.number().strict().optional(),
});
exports.issueTypeQueryValidation = joi_1.default.object().keys({
    page: joi_1.default.number().optional(),
    limit: joi_1.default.number().optional(),
    tripId: joi_1.default.number().optional(),
    reasonId: joi_1.default.number().optional(),
    userId: joi_1.default.number().optional(),
});
