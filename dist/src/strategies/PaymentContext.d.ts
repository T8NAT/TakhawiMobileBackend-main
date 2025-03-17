import { Payment } from '../interfaces/PaymentStrategy';
import { PaymentInputType } from '../types/paymentGatewayType';
export declare class PaymentContext {
    private payment;
    constructor(payment: Payment);
    processPayment(data: PaymentInputType): Promise<void | {
        html: string;
        checkOutId: string;
        transactionId: string;
        path: string;
    }>;
}
