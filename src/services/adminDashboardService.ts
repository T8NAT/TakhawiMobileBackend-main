import prisma from '../../prisma/client';
import { TripStatus, TripType } from '../enum/trip';
import { UserStatus } from '../enum/userStatus';
import { IAdminDashboardService } from '../interfaces/adminDashboardService';
import { paginate } from '../utils/pagination';
import {
  EarningsSummary,
  TripStatisticsType,
  TripStatusReport,
  UserStatusType,
  UserTransactionsQueryType,
} from '../types/adminDashboardService';

class AdminDashboardService implements IAdminDashboardService {
  async getDriverStatistics(): Promise<UserStatusType> {
    const driver_status: UserStatusType = {
      [UserStatus.REGISTERED]: 0,
      [UserStatus.PENDING]: 0,
      [UserStatus.REJECTED]: 0,
      [UserStatus.APPROVED]: 0,
      [UserStatus.SUSPENDED]: 0,
    };
    const drivers = await prisma.user.groupBy({
      by: ['driver_status'],
      _count: true,
    });

    drivers.forEach((driver) => {
      if (driver_status.hasOwnProperty(driver.driver_status)) {
        driver_status[driver.driver_status as UserStatus] = driver._count;
      }
    });

    return driver_status;
  }

  async getTripStatistics(): Promise<TripStatusReport> {
    const basicTrips = await prisma.trip.groupBy({
      by: ['status'],
      _count: true,
      where: {
        type: TripType.BASICTRIP,
      },
    });
    const basic_trip_status: TripStatisticsType = {
      [TripStatus.COMPLETED]: 0,
      [TripStatus.CANCELLED]: 0,
    };
    basicTrips.forEach((trip) => {
      if (basic_trip_status.hasOwnProperty(trip.status)) {
        basic_trip_status[trip.status as TripStatus] = trip._count;
      }
    });

    const vipTrips = await prisma.trip.groupBy({
      by: ['status'],
      _count: true,
      where: {
        type: TripType.VIPTRIP,
      },
    });
    const vip_trip_status: TripStatisticsType = {
      [TripStatus.COMPLETED]: 0,
      [TripStatus.CANCELLED]: 0,
    };
    vipTrips.forEach((trip) => {
      if (vip_trip_status.hasOwnProperty(trip.status)) {
        vip_trip_status[trip.status as TripStatus] = trip._count;
      }
    });
    return {
      basic_trip_status,
      vip_trip_status,
    };
  }

  async getUserTransactions(
    query: UserTransactionsQueryType,
    modelName: string,
  ) {
    let userId;
    modelName === 'driver_Wallet_Transaction'
      ? (userId = 'driver_id')
      : (userId = 'passenger_id');

    return paginate(
      modelName,
      {
        where: {
          [userId]: query.user_id ? +query.user_id : undefined,
          transaction_type: query.transaction_type,
        },
      },
      query.page,
      query.limit,
    );
  }

  async generateEarningsReport(): Promise<EarningsSummary> {
    let completedTripsEarningsSummary: EarningsSummary;

    const earnings = await prisma.trip.aggregate({
      where: {
        status: TripStatus.COMPLETED,
      },
      _sum: {
        price: true,
        discount: true,
        driver_app_share: true,
        user_app_share: true,
        user_debt: true,
      },
    });

    return (completedTripsEarningsSummary = {
      total_trip_price: earnings._sum.price ?? 0,
      net_profit:
        earnings._sum.user_app_share! +
        earnings._sum.driver_app_share! -
        earnings._sum.discount!,
      discount: earnings._sum.discount ?? 0,
      user_app_share: earnings._sum.user_app_share ?? 0,
      driver_app_share: earnings._sum.driver_app_share ?? 0,
    });
  }
}
const adminDashboardService = new AdminDashboardService();
export default adminDashboardService;
