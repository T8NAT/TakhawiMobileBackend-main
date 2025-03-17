import { Payment } from '../interfaces/PaymentStrategy';
import { PaymentInputType } from '../types/paymentGatewayType';
export declare class CardPayment implements Payment {
    processPayment(data: PaymentInputType): Promise<void>;
}
