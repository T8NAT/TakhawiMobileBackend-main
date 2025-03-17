"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentFactory = void 0;
const CardPayment_1 = require("./CardPayment");
const WalletPayment_1 = require("./WalletPayment");
const CashPayment_1 = require("./CashPayment");
const PaymentContext_1 = require("./PaymentContext");
const payment_1 = require("../enum/payment");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const ApplePay_1 = require("./ApplePay");
class PaymentFactory {
    static createPaymentContext(method) {
        switch (method) {
            case payment_1.PaymentMethod.CARD:
                return new PaymentContext_1.PaymentContext(new CardPayment_1.CardPayment());
            case payment_1.PaymentMethod.WALLET:
                return new PaymentContext_1.PaymentContext(new WalletPayment_1.WalletPayment());
            case payment_1.PaymentMethod.CASH:
                return new PaymentContext_1.PaymentContext(new CashPayment_1.CashPayment());
            case payment_1.PaymentMethod.APPLEPAY:
                return new PaymentContext_1.PaymentContext(new ApplePay_1.ApplePay());
            default:
                throw new ApiError_1.default('Invalid payment method', 400);
        }
    }
}
exports.PaymentFactory = PaymentFactory;
