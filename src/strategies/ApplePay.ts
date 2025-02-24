import pug from 'pug';
import { Payment } from '../interfaces/PaymentStrategy';
import paymentGatewayService from '../services/paymentGatewayService';
import { PaymentInputType } from '../types/paymentGatewayType';
import { TripType } from '../enum/trip';

export class ApplePay implements Payment {
  async processPayment(data: PaymentInputType): Promise<{
    html: string;
    checkOutId: string;
    transactionId: string;
    path: string;
  }> {
    const amount = Number(data.amount).toFixed(2);
    const checkOut = await paymentGatewayService.prepareCheckout({
      amount,
    });

    const path =
      data.type === TripType.VIPTRIP
        ? `offer/apple-pay/accept/${checkOut.id}`
        : `basic-trip/apple-pay/join/${checkOut.id}`;
    const html = pug.renderFile('./src/templates/applePay.pug', {
      checkoutId: checkOut.id,
      amount,
      path,
    });
    return {
      html,
      checkOutId: checkOut.id,
      transactionId: checkOut.id,
      path,
    };
  }
}
