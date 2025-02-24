import { Payment } from '../interfaces/PaymentStrategy';
import userManagementService from '../services/userManagementService';
import userService from '../services/userService';
import { PaymentInputType } from '../types/paymentGatewayType';

export class WalletPayment implements Payment {
  async processPayment(data: PaymentInputType): Promise<void> {
    const user = await userService.getUserById(data.userId);

    await userManagementService.checkBalanceAndUpdateWallet(
      user,
      data.amount,
      data.tripOrOfferId!,
    );
  }
}
