import { PaymentInputType } from '../types/paymentGatewayType';

export interface Payment {
  processPayment(data: PaymentInputType): Promise<void | {
    html: string;
    checkOutId: string;
    transactionId: string;
    path: string;
  }>;
}
