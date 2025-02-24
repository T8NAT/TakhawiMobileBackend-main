import pug from 'pug';
import { Request, Response, NextFunction } from 'express';
import paymentGatewayService from '../services/paymentGatewayService';
import response from '../utils/response';

class PaymentGatewayController {
  async getApplePaySession(req: Request, res: Response, next: NextFunction) {
    try {
      const checkoutId = req.query.checkoutId as string;
      const type = req.query.type as string;
      const amount = await paymentGatewayService.getSessionAmount(
        checkoutId,
        type,
      );
      const html = pug.renderFile('./src/templates/applePay.pug', {
        checkoutId,
        amount: Number(amount).toFixed(2),
        path:
          type === 'offer'
            ? `offer/apple-pay/accept/${checkoutId}`
            : `basic-trip/apple-pay/join/${checkoutId}`,
      });
      res.send(html);
    } catch (error) {
      next(error);
    }
  }

  async prepareCheckout(req: Request, res: Response, next: NextFunction) {
    try {
      const checkout = await paymentGatewayService.prepareCheckout();
      response(res, 200, {
        status: true,
        message: checkout.result.description,
        result: checkout,
      });
    } catch (error) {
      next(error);
    }
  }

  async getInitialPaymentStatus(req: Request, res: Response) {
    const domain = `${req.protocol}://${req.get('host')}`;
    try {
      const { checkOutId, userId } = req.params;
      await paymentGatewayService.getInitialPaymentStatus(checkOutId, +userId);
      res.redirect(`${domain}/api/payment-status/success`);
    } catch (error) {
      res.redirect(
        `${domain}/api/payment-status/fail?errorMessage=${(error as Error).message}`,
      );
    }
  }
}

const paymentGatewayController = new PaymentGatewayController();
export default paymentGatewayController;
