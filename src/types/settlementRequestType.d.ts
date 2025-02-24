import { QueryType } from './queryType';
import { User } from './userType';

export default interface ISettlementRequest {
  id: number;
  status: string;
  holder_name: string;
  bank_name: string;
  bank_account_number: string;
  iban: string;
  amount: number;
  user_id: number;
  createdAt: Date;
  updatedAt: Date;
  User?: Partial<User>;
}

export type CreateSettlementRequest = Omit<
  ISettlementRequest,
  'id' | 'status' | 'User' | 'createdAt' | 'updatedAt'
>;

export type SettlementRequestQuery = Partial<
  QueryType & {
    status: string;
  }
>;
