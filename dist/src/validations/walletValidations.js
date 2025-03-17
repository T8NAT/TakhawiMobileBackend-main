"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rechargeWalletSchema = exports.walletTransactionsQuerySchema = void 0;
const joi_1 = __importDefault(require("joi"));
const wallet_1 = require("../enum/wallet");
exports.walletTransactionsQuerySchema = joi_1.default.object().keys({
    page: joi_1.default.number().optional(),
    limit: joi_1.default.number().optional(),
    from: joi_1.default.date().optional(),
    to: joi_1.default.date().optional(),
    type: joi_1.default.string()
        .valid(...Object.values(wallet_1.TransactionType))
        .optional(),
});
exports.rechargeWalletSchema = joi_1.default.object().keys({
    amount: joi_1.default.number().required(),
    cardId: joi_1.default.number().required(),
});
