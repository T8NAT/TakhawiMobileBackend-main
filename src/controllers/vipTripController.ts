import { Request, Response, NextFunction } from 'express';
import vipTripService from '../services/vipTripService';
import CustomRequest from '../interfaces/customRequest';
import response from '../utils/response';
import { serializeVehicle } from '../utils/serialization/vehicle.serialization';
import { customEventEmitter } from '../utils/event-listner';
import { serializeHobbies } from '../utils/serialization/hobbies.serialization';

class VipTripController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, gender } = req as CustomRequest;
      const trip = await vipTripService.create({
        ...req.body,
        gender,
        passnger_id: user,
      });
      response(res, 201, {
        status: true,
        message: 'Trip created successfully',
        result: trip,
      });
      customEventEmitter.emit('newVipTrip', trip);
    } catch (error) {
      next(error);
    }
  }

  async cancel(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req as CustomRequest;
      const data = await vipTripService.cancel(
        +req.params.trip_id,
        user,
        req.body,
      );
      response(res, 200, {
        status: true,
        message: 'Trip cancelled successfully',
      });
      if (data) customEventEmitter.emit('userCancelation', data);
    } catch (error) {
      next(error);
    }
  }

  async driverCancelation(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req as CustomRequest;
      const data = await vipTripService.driverCancelation(
        +req.params.trip_id,
        user,
        req.body,
      );
      response(res, 200, {
        status: true,
        message: 'Trip cancelled by driver',
      });
      customEventEmitter.emit('driverCancelation', data);
    } catch (error) {
      next(error);
    }
  }

  async getTripOffers(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await vipTripService.getTripOffers(
        +req.params.trip_id,
        req.query,
      );
      const { language, skipLang } = req as CustomRequest;
      const serializedData = data.data.map((offer: any): any => {
        if (
          offer.Driver &&
          offer.Driver.Vehicles &&
          offer.Driver.Vehicles.length > 0
        ) {
          offer.Driver.Vehicles = serializeVehicle(
            offer.Driver.Vehicles[0],
            language,
          );
        }
        return offer;
      });
      response(res, 200, {
        status: true,
        message: 'Offers retrieved successfully',
        pagination: data.pagination,
        result: skipLang ? data.data : serializedData,
      });
    } catch (error) {
      next(error);
    }
  }

  async endTrip(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req as CustomRequest;
      const { tripStatusInfo, tripSummary } = await vipTripService.endTrip(
        user,
        +req.params.trip_id,
      );
      response(res, 200, {
        status: true,
        message: 'Trip ended',
        result: tripSummary,
      });
      customEventEmitter.emit('tripStatusUpdate', tripStatusInfo);
      customEventEmitter.emit('endTrip', tripSummary);
    } catch (error) {
      next(error);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const { language } = req as CustomRequest;
      const trip = await vipTripService.getOne(+req.params.id);
      response(res, 200, {
        status: true,
        message: 'Vip Trip Featched Successfully',
        result: {
          ...trip,
          Passnger: {
            ...trip.Passnger,
            Hobbies: serializeHobbies(trip.Passnger.Hobbies, language),
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

const vipTripController = new VipTripController();
export default vipTripController;
