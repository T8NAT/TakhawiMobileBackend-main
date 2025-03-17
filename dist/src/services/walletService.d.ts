import { RechargeWallet, WalletHistoryQuery } from '../types/walletType';
declare class WalletService {
    getUserWalletHistory(user_id: number, queryString: WalletHistoryQuery): Promise<{
        pagination: {
            totalPages: number;
            totalItems: any;
            page: number;
            limit: number;
        };
        data: any;
    }>;
    getDriverWalletHistory(driver_id: number, queryString: WalletHistoryQuery): Promise<{
        pagination: {
            totalPages: number;
            totalItems: any;
            page: number;
            limit: number;
        };
        data: any;
    }>;
    walletRecharge(data: RechargeWallet): Promise<{
        notification: {
            User: {
                uuid: string;
                User_FCM_Tokens: {
                    id: number;
                    token: string;
                    userId: number;
                    createdAt: Date;
                }[];
                prefered_language: string;
            };
            id: number;
            ar_title: string;
            ar_body: string;
            en_title: string;
            en_body: string;
            type: string;
            is_read: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: number;
        };
        balance: number;
        amount: number;
    }>;
}
declare const walletService: WalletService;
export default walletService;
