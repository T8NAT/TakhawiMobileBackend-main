import prisma from '../../prisma/client';
import { NotificationTypes } from '../enum/notification';
import { TransactionType } from '../enum/wallet';
import { PaymentDataType } from '../types/paymentGatewayType';
import { RechargeWallet, WalletHistoryQuery } from '../types/walletType';
import ApiError from '../utils/ApiError';
import { paginate } from '../utils/pagination';
import paymentGatewayService from './paymentGatewayService';

class WalletService {
  async getUserWalletHistory(user_id: number, queryString: WalletHistoryQuery) {
    return paginate(
      'passenger_Wallet_Transaction',
      {
        where: {
          passenger_id: user_id,
          createdAt: {
            gte: queryString.from,
            lte: queryString.to,
          },
          transaction_type: queryString.type,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      queryString.page,
      queryString.limit,
    );
  }

  async getDriverWalletHistory(
    driver_id: number,
    queryString: WalletHistoryQuery,
  ) {
    return paginate(
      'driver_Wallet_Transaction',
      {
        where: {
          driver_id,
          createdAt: {
            gte: queryString.from,
            lte: queryString.to,
          },
          transaction_type: queryString.type,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      queryString.page,
      queryString.limit,
    );
  }

  async walletRecharge(data: RechargeWallet) {
    const user = await prisma.user.findUnique({
      where: {
        id: data.userId,
      },
      select: {
        user_wallet_balance: true,
        Saved_Card: {
          where: {
            id: data.cardId,
          },
        },
      },
    });
    if (!user) throw new ApiError('User not found', 404);
    if (!user.Saved_Card.length) throw new ApiError('Card not found', 404);

    const paymentData: PaymentDataType = {
      amount: data.amount,
      cardId: data.cardId,
      merchantTransactionId: new Date().getTime().toString(),
      recurringAgreementId: user.Saved_Card[0].recurringAgreementId,
      token: user.Saved_Card[0].token,
      userId: data.userId,
    };

    await paymentGatewayService.sendPaymentData(paymentData);
    const paymentUser = await prisma.user.update({
      where: {
        id: data.userId,
      },
      data: {
        user_wallet_balance: { increment: data.amount },
        Passenger_Wallet_Transaction: {
          create: {
            amount: data.amount,
            transaction_type: TransactionType.WALLET_RECHARGE,
            previous_balance: user.user_wallet_balance,
            current_balance: user.user_wallet_balance + data.amount,
          },
        },
        Notifications: {
          create: {
            ar_title: 'تم شحن المحفظة',
            en_title: 'Wallet Recharged',
            ar_body: `تم شحن محفظتك بمبلغ ${data.amount} ريال`,
            en_body: `Your wallet has been recharged with ${data.amount} SAR`,
            type: NotificationTypes.ADD_MONEY,
          },
        },
      },
      select: {
        uuid: true,
        User_FCM_Tokens: true,
        user_wallet_balance: true,
        prefered_language: true,
        Notifications: {
          take: 1,
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
    return {
      notification: {
        ...paymentUser.Notifications[0],
        User: {
          uuid: paymentUser.uuid,
          User_FCM_Tokens: paymentUser.User_FCM_Tokens,
          prefered_language: paymentUser.prefered_language,
        },
      },
      balance: paymentUser.user_wallet_balance,
      amount: data.amount,
    };
  }
}

const walletService = new WalletService();
export default walletService;
