"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplePay = void 0;
const pug_1 = __importDefault(require("pug"));
const paymentGatewayService_1 = __importDefault(require("../services/paymentGatewayService"));
const trip_1 = require("../enum/trip");
class ApplePay {
    async processPayment(data) {
        const amount = Number(data.amount).toFixed(2);
        const checkOut = await paymentGatewayService_1.default.prepareCheckout({
            amount,
        });
        const path = data.type === trip_1.TripType.VIPTRIP ? `offer/apple-pay/accept/${checkOut.id}` : `basic-trip/apple-pay/join/${checkOut.id}`;
        const html = pug_1.default.renderFile('./src/templates/applePay.pug', {
            checkoutId: checkOut.id,
            amount,
            path,
        });
        return {
            html,
            checkOutId: checkOut.id,
            transactionId: checkOut.id,
            path,
        };
    }
}
exports.ApplePay = ApplePay;
