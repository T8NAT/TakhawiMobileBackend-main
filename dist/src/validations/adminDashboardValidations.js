"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userTransactionsQueryValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const wallet_1 = require("../enum/wallet");
exports.userTransactionsQueryValidation = joi_1.default.object().keys({
    transaction_type: joi_1.default.string().valid(...Object.values(wallet_1.TransactionType)),
    user_id: joi_1.default.number(),
    limit: joi_1.default.number(),
    page: joi_1.default.number(),
});
