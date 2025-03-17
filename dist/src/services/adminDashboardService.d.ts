import { IAdminDashboardService } from '../interfaces/adminDashboardService';
import { EarningsSummary, TripStatusReport, UserStatusType, UserTransactionsQueryType } from '../types/adminDashboardService';
declare class AdminDashboardService implements IAdminDashboardService {
    getDriverStatistics(): Promise<UserStatusType>;
    getTripStatistics(): Promise<TripStatusReport>;
    getUserTransactions(query: UserTransactionsQueryType, modelName: string): Promise<{
        pagination: {
            totalPages: number;
            totalItems: any;
            page: number;
            limit: number;
        };
        data: any;
    }>;
    generateEarningsReport(): Promise<EarningsSummary>;
}
declare const adminDashboardService: AdminDashboardService;
export default adminDashboardService;
