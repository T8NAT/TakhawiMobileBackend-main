import { QueryType } from './queryType';

export interface PromoCode {
  id: number;
  code: string;
  from: Date;
  to: Date;
  type: string;
  is_active: boolean;
  amount: number;
  max_discount: number | null;
  limit: number;
  time_used: number;
  limit_per_user: number;
  userId: number | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

type PromoCodeType = 'FIXED' | 'PERCENTAGE';

export type CreatePromoCode = Omit<
  PromoCode,
  | 'id'
  | 'time_used'
  | 'limit_per_user'
  | 'createdAt'
  | 'updatedAt'
  | 'deletedAt'
>;
export type UpdatePromoCode = Partial<CreatePromoCode>;
export type PromoCodeQueryType = QueryType & {};
