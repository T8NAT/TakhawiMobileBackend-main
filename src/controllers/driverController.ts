import { Request, Response, NextFunction } from 'express';
import CustomRequest from '../interfaces/customRequest';
import response from '../utils/response';
import driverService from '../services/driverService';

class DriverController {
  async uploadNationalID(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { user, role } = req as CustomRequest;
      const { national_id } = req.body;
      await driverService.uploadNationalID(
        user,
        national_id,
        role,
        req.files as Express.Request['files'],
      );
      response(res, 201, {
        status: true,
        message: 'National ID uploaded successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async uploadDriverLicense(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = (req as CustomRequest).user;
      await driverService.uploadDriverLicense(
        userId,
        req.files as Express.Request['files'],
      );
      response(res, 201, {
        status: true,
        message: 'Driver license uploaded successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async checkUploadStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { temp_id } = req as CustomRequest;
      const status = await driverService.checkUploadStatus(temp_id);
      response(res, 200, {
        status: true,
        message: 'Upload status checked successfully',
        result: status,
      });
    } catch (error) {
      next(error);
    }
  }

  async getNearestDrivers(req: Request, res: Response, next: NextFunction) {
    try {
      const { gender } = req as CustomRequest;
      const drivers = await driverService.getNearestDrivers(
        { lat: +req.query.lat!, lng: +req.query.lng! },
        gender,
        10,
      );
      response(res, 200, {
        status: true,
        message: 'Drivers fetched successfully',
        result: drivers,
      });
    } catch (error) {
      next(error);
    }
  }
}

const driverController = new DriverController();
export default driverController;
