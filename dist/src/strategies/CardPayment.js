"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardPayment = void 0;
const paymentGatewayService_1 = __importDefault(require("../services/paymentGatewayService"));
const savedCardService_1 = __importDefault(require("../services/savedCardService"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
class CardPayment {
    async processPayment(data) {
        const card = await savedCardService_1.default.getOne(data.cardId, data.userId);
        if (!card)
            throw new ApiError_1.default('Card not found', 404);
        const paymentData = {
            amount: data.amount,
            token: card.token,
            recurringAgreementId: card.recurringAgreementId,
            merchantTransactionId: `${new Date().getTime()}`,
            userId: data.userId,
            cardId: card.id,
        };
        await paymentGatewayService_1.default.sendPaymentData(paymentData);
    }
}
exports.CardPayment = CardPayment;
