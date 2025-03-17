import { Request, Response, NextFunction } from 'express';
declare class PaymentGatewayController {
    getApplePaySession(req: Request, res: Response, next: NextFunction): Promise<void>;
    prepareCheckout(req: Request, res: Response, next: NextFunction): Promise<void>;
    getInitialPaymentStatus(req: Request, res: Response): Promise<void>;
}
declare const paymentGatewayController: PaymentGatewayController;
export default paymentGatewayController;
