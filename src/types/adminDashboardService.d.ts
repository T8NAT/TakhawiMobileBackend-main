import { TripStatus } from '../enum/trip';
import { QueryType } from './queryType';

export type UserStatusType = Record<UserStatus, number>;

export type TripStatisticsType = Partial<Record<TripStatus, number>>;

export type TripStatusReport = {
  basic_trip_status: TripStatisticsType;
  vip_trip_status: TripStatisticsType;
};

export type EarningsSummary = {
  total_trip_price: number;
  net_profit: number;
  discount: number;
  driver_app_share: number;
  user_app_share: number;
};

export type UserTransactionsQueryType = QueryType & {
  transaction_type?: string;
  user_id?: number;
};
