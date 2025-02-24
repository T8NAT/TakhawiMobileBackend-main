import { CardPayment } from './CardPayment';
import { WalletPayment } from './WalletPayment';
import { CashPayment } from './CashPayment';
import { PaymentContext } from './PaymentContext';
import { PaymentMethod } from '../enum/payment';
import ApiError from '../utils/ApiError';
import { ApplePay } from './ApplePay';

export class PaymentFactory {
  static createPaymentContext(method: PaymentMethod): PaymentContext {
    switch (method) {
      case PaymentMethod.CARD:
        return new PaymentContext(new CardPayment());
      case PaymentMethod.WALLET:
        return new PaymentContext(new WalletPayment());
      case PaymentMethod.CASH:
        return new PaymentContext(new CashPayment());
      case PaymentMethod.APPLEPAY:
        return new PaymentContext(new ApplePay());
      default:
        throw new ApiError('Invalid payment method', 400);
    }
  }
}
