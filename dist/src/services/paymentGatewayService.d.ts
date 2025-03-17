import { PaymentDataType, ReqOptions, ReqOptionsType, ResponseCheckoutType, ResponseType, UserBillingType } from '../types/paymentGatewayType';
declare class PaymentGatewayService {
    static requestHandler: <T extends ResponseType>(options: ReqOptions, data?: string) => Promise<T>;
    static reqOptions: (config: ReqOptionsType) => ReqOptions;
    static handleResult<T>(response: T, allowPending?: boolean): T;
    prepareCheckout(checkOutData?: any): Promise<ResponseCheckoutType>;
    prepareCheckoutCredit(userBillingInfo: UserBillingType): Promise<ResponseCheckoutType>;
    getInitialPaymentStatus(checkOutId: string, userId: number): Promise<void>;
    getPaymentStatus(checkoutId: string): Promise<void>;
    sendPaymentData(paymentData: PaymentDataType): Promise<void>;
    deleteRegistration(token: string): Promise<void>;
    getSessionAmount(checkoutId: string, type: string): Promise<number>;
}
declare const paymentGatewayService: PaymentGatewayService;
export default paymentGatewayService;
