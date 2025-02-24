import { Payment } from '../interfaces/PaymentStrategy';
import paymentGatewayService from '../services/paymentGatewayService';
import savedCardService from '../services/savedCardService';
import { PaymentDataType, PaymentInputType } from '../types/paymentGatewayType';
import ApiError from '../utils/ApiError';

export class CardPayment implements Payment {
  async processPayment(data: PaymentInputType): Promise<void> {
    const card = await savedCardService.getOne(data.cardId!, data.userId);
    if (!card) throw new ApiError('Card not found', 404);
    const paymentData: PaymentDataType = {
      amount: data.amount,
      token: card.token,
      recurringAgreementId: card.recurringAgreementId,
      merchantTransactionId: `${new Date().getTime()}`,
      userId: data.userId,
      cardId: card.id,
    };
    await paymentGatewayService.sendPaymentData(paymentData);
  }
}
