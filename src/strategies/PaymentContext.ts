import { Payment } from '../interfaces/PaymentStrategy';
import { PaymentInputType } from '../types/paymentGatewayType';

export class PaymentContext {
  private payment: Payment;

  constructor(payment: Payment) {
    this.payment = payment;
  }

  async processPayment(data: PaymentInputType): Promise<void | {
    html: string;
    checkOutId: string;
    transactionId: string;
    path: string;
  }> {
    return this.payment.processPayment(data);
  }
}
