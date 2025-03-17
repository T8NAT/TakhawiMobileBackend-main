import { PaymentContext } from './PaymentContext';
import { PaymentMethod } from '../enum/payment';
export declare class PaymentFactory {
    static createPaymentContext(method: PaymentMethod): PaymentContext;
}
