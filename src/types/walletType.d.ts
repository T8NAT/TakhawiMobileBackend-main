import { QueryType } from './queryType';

export type RechargeWallet = {
  amount: number;
  userId: number;
  cardId: number;
};

export type WalletHistoryQuery = Partial<
  QueryType & {
    from: Date;
    to: Date;
    type: string;
  }
>;
