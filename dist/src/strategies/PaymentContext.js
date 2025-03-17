"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentContext = void 0;
class PaymentContext {
    constructor(payment) {
        this.payment = payment;
    }
    async processPayment(data) {
        return this.payment.processPayment(data);
    }
}
exports.PaymentContext = PaymentContext;
