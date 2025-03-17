"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.settlementRequestQuerySchema = exports.createSettlementRequestSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const settlementRequest_1 = require("../enum/settlementRequest");
exports.createSettlementRequestSchema = joi_1.default.object().keys({
    holder_name: joi_1.default.string().required(),
    bank_name: joi_1.default.string().required(),
    bank_account_number: joi_1.default.string().required(),
    iban: joi_1.default.string().required(),
    amount: joi_1.default.number().strict().required(),
});
exports.settlementRequestQuerySchema = joi_1.default.object().keys({
    page: joi_1.default.number(),
    limit: joi_1.default.number(),
    status: joi_1.default.string().valid(...Object.values(settlementRequest_1.SettlementRequestStatus)),
});
