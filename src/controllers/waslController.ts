import { Request, Response, NextFunction } from 'express';
import CustomRequest from '../interfaces/customRequest';
import response from '../utils/response';
import waslService from '../services/waslService';
import { Roles } from '../enum/roles';

class WaslController {
  async createDriverandVehicleRegistration(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { user, role } = req as CustomRequest;
      const userId = role === Roles.DRIVER ? user : req.body.userId;
      const wasl = await waslService.createDriverandVehicleRegistration(userId);
      response(res, 200, {
        status: true,
        message: 'Driver and Vehicle registration created successfully',
        result: wasl,
      });
    } catch (error) {
      next(error);
    }
  }

  async getDriverandVehicleRegistration(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { user, role } = req as CustomRequest;
      const userId = role === Roles.DRIVER ? user : +req.query.userId!;
      const wasl = await waslService.getDriverandVehicleRegistration(userId);
      response(res, 200, {
        status: true,
        message: 'Driver and Vehicle registration fetched successfully',
        result: wasl,
      });
    } catch (error) {
      next(error);
    }
  }

  async createTripRegistration(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const trip = await waslService.createTripRegistration(req.body);
      response(res, 200, {
        status: trip.status,
        message: trip.success ? 'Trip created successfully' : trip.result_code,
        result: trip,
      });
    } catch (error) {
      next(error);
    }
  }

  async getTripsLog(req: Request, res: Response, next: NextFunction) {
    try {
      const trips = await waslService.getTripsLog(req.query);
      response(res, 200, {
        status: true,
        message: 'Trips log fetched successfully',
        result: trips,
      });
    } catch (error) {
      next(error);
    }
  }
}

const waslController = new WaslController();
export default waslController;
