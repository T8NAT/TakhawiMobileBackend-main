import { Request, Response, NextFunction } from 'express';
import driverReportService from '../services/driverReportService';
import CustomRequest from '../interfaces/customRequest';
import response from '../utils/response';
import { serializeTripReportObject } from '../utils/serialization/tripReport.serializatio';

class DriverReportController {
  async getDriverReportPerMonth(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const driverId = (req as CustomRequest).user;
      const profit = await driverReportService.getDriverReportPerMonth(
        driverId,
        req.query.noOfMonth as string,
      );
      response(res, 200, {
        status: true,
        message: 'Driver report fetched successfully',
        result: profit,
      });
    } catch (error) {
      next(error);
    }
  }

  async getDriverProfitReport(req: Request, res: Response, next: NextFunction) {
    try {
      const { user: driverId, language } = req as CustomRequest;
      const { data, pagination } =
        await driverReportService.getDriverProfitReport(
          driverId,
          language,
          req.query,
        );
      response(res, 200, {
        status: true,
        message: 'Driver profit report fetched successfully',
        result: data,
        pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  async getOneTripReport(req: Request, res: Response, next: NextFunction) {
    try {
      const { user: driverId, language } = req as CustomRequest;
      const trip = await driverReportService.getOneTripReport(
        driverId,
        +req.params.tripId,
      );
      response(res, 200, {
        status: true,
        message: 'Driver trip report fetched successfully',
        result: serializeTripReportObject(trip, language),
      });
    } catch (error) {
      next(error);
    }
  }

  async tripReviewReport(req: Request, res: Response, next: NextFunction) {
    try {
      const { user: driverId } = req as CustomRequest;
      const reviews = await driverReportService.tripReviewReport(
        driverId,
        +req.params.tripId,
      );
      response(res, 200, {
        status: true,
        message: 'Driver trip reviews fetched successfully',
        result: reviews,
      });
    } catch (error) {
      next(error);
    }
  }

  async getDriverFinancialSummary(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { user } = req as CustomRequest;
      const financialSummary =
        await driverReportService.getDriverFinancialSummary(user);
      response(res, 200, {
        status: true,
        message: 'Driver financial summary fetched successfully',
        result: financialSummary,
      });
    } catch (error) {
      next(error);
    }
  }
}

const driverReportController = new DriverReportController();
export default driverReportController;
