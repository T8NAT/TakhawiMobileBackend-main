import {
  EarningsSummary,
  TripStatusReport,
  UserStatusType,
  UserTransactionsQueryType,
} from '../types/adminDashboardService';

export interface IAdminDashboardService {
  getDriverStatistics(): Promise<UserStatusType>;
  getTripStatistics(): Promise<TripStatusReport>;
  generateEarningsReport(): Promise<EarningsSummary>;
  getUserTransactions(query: UserTransactionsQueryType, modelName: string);
}
