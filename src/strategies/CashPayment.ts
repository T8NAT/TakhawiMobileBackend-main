import { Payment } from '../interfaces/PaymentStrategy';
import { PaymentInputType } from '../types/paymentGatewayType';

export class CashPayment implements Payment {
  async processPayment(data: PaymentInputType): Promise<void> {
    // Do nothing
  }
}
