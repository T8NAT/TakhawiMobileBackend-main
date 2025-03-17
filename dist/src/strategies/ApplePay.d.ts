import { Payment } from '../interfaces/PaymentStrategy';
import { PaymentInputType } from '../types/paymentGatewayType';
export declare class ApplePay implements Payment {
    processPayment(data: PaymentInputType): Promise<{
        html: string;
        checkOutId: string;
        transactionId: string;
        path: string;
    }>;
}
