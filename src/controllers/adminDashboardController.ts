import { Request, Response, NextFunction } from 'express';
import adminDashboardService from '../services/adminDashboardService';
import response from '../utils/response';

class AdminDashboardController {
  async getDriverStatistics(req: Request, res: Response, next: NextFunction) {
    try {
      const driverStatistics =
        await adminDashboardService.getDriverStatistics();
      response(res, 200, {
        status: true,
        message: 'Driver statistics fetched successfully',
        result: driverStatistics,
      });
    } catch (error) {
      next(error);
    }
  }

  async getTripStatistics(req: Request, res: Response, next: NextFunction) {
    try {
      const tripStatistics = await adminDashboardService.getTripStatistics();
      response(res, 200, {
        status: true,
        message: 'Trip statistics fetched successfully',
        result: tripStatistics,
      });
    } catch (error) {
      next(error);
    }
  }

  async getPassengerTransactions(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userTransactions = await adminDashboardService.getUserTransactions(
        req.query,
        'passenger_Wallet_Transaction',
      );
      response(res, 200, {
        status: true,
        message: 'User transactions fetched successfully',
        result: userTransactions,
      });
    } catch (error) {
      next(error);
    }
  }

  async getDriverTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      const userTransactions = await adminDashboardService.getUserTransactions(
        req.query,
        'driver_Wallet_Transaction',
      );
      response(res, 200, {
        status: true,
        message: 'User transactions fetched successfully',
        result: userTransactions,
      });
    } catch (error) {
      next(error);
    }
  }
  async generateEarningsReport(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const earningsReport =
        await adminDashboardService.generateEarningsReport();
      response(res, 200, {
        status: true,
        message: 'Earnings report generated successfully',
        result: earningsReport,
      });
    } catch (error) {
      next(error);
    }
  }
}

const adminDashboardController = new AdminDashboardController();
export default adminDashboardController;
