import { Payment } from '../interfaces/PaymentStrategy';
import { PaymentInputType } from '../types/paymentGatewayType';
export declare class WalletPayment implements Payment {
    processPayment(data: PaymentInputType): Promise<void>;
}
