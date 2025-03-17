"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __importDefault(require("../../prisma/client"));
const notification_1 = require("../enum/notification");
const wallet_1 = require("../enum/wallet");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const pagination_1 = require("../utils/pagination");
const paymentGatewayService_1 = __importDefault(require("./paymentGatewayService"));
class WalletService {
    async getUserWalletHistory(user_id, queryString) {
        return (0, pagination_1.paginate)('passenger_Wallet_Transaction', {
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
        }, queryString.page, queryString.limit);
    }
    async getDriverWalletHistory(driver_id, queryString) {
        return (0, pagination_1.paginate)('driver_Wallet_Transaction', {
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
        }, queryString.page, queryString.limit);
    }
    async walletRecharge(data) {
        const user = await client_1.default.user.findUnique({
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
        if (!user)
            throw new ApiError_1.default('User not found', 404);
        if (!user.Saved_Card.length)
            throw new ApiError_1.default('Card not found', 404);
        const paymentData = {
            amount: data.amount,
            cardId: data.cardId,
            merchantTransactionId: new Date().getTime().toString(),
            recurringAgreementId: user.Saved_Card[0].recurringAgreementId,
            token: user.Saved_Card[0].token,
            userId: data.userId,
        };
        await paymentGatewayService_1.default.sendPaymentData(paymentData);
        const paymentUser = await client_1.default.user.update({
            where: {
                id: data.userId,
            },
            data: {
                user_wallet_balance: { increment: data.amount },
                Passenger_Wallet_Transaction: {
                    create: {
                        amount: data.amount,
                        transaction_type: wallet_1.TransactionType.WALLET_RECHARGE,
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
                        type: notification_1.NotificationTypes.ADD_MONEY,
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
exports.default = walletService;
