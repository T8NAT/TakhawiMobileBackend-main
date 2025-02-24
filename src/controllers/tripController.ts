import { Request, Response, NextFunction } from 'express';
import CustomRequest from '../interfaces/customRequest';
import tripService from '../services/tripService';
import response from '../utils/response';
import { serializeTripList } from '../utils/serialization/trip.serialization';
import { serializeTrips } from '../utils/serialization/trips.serialization';
import { serializeActiveTrip } from '../utils/serialization/activeTrip.serialization';
import { customEventEmitter } from '../utils/event-listner';

class TripController {
  async getCompletedTrips(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, language, role } = req as CustomRequest;
      const { data, pagination } = await tripService.getCompletedTrips(
        user,
        req.query,
        role,
      );
      response(res, 200, {
        status: true,
        message: 'Completed trips fetched successfully',
        pagination,
        result: serializeTripList(data, language, role),
      });
    } catch (error) {
      next(error);
    }
  }

  async getCancelledTrips(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, language, role } = req as CustomRequest;
      const { data, pagination } = await tripService.getCancelledTrips(
        user,
        req.query,
        role,
      );
      response(res, 200, {
        status: true,
        message: 'Cancelled trips fetched successfully',
        pagination,
        result: serializeTripList(data, language, role),
      });
    } catch (error) {
      next(error);
    }
  }

  async getUpcomingTrips(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, language, role } = req as CustomRequest;
      const { data, pagination } = await tripService.getUpcomingTrips(
        user,
        req.query,
        role,
      );
      response(res, 200, {
        status: true,
        message: 'Upcoming trips fetched successfully',
        pagination,
        result: serializeTripList(data, language, role),
      });
    } catch (error) {
      next(error);
    }
  }

  async getTrips(req: Request, res: Response, next: NextFunction) {
    try {
      const { language, skipLang } = req as CustomRequest;
      const { data, pagination } = await tripService.getTrips(req.query);
      response(res, 200, {
        status: true,
        message: 'Trips fetched successfully',
        pagination,
        result: skipLang ? data : serializeTrips(data, language),
      });
    } catch (error) {
      next(error);
    }
  }

  async updateTripStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { status } = req.body;
      const { user } = req as CustomRequest;
      const data = await tripService.updateTripStatus(
        +req.params.tripId,
        status,
        user,
      );
      response(res, 200, {
        status: true,
        message: 'Trip status updated successfully',
      });
      customEventEmitter.emit('tripStatusUpdate', data);
    } catch (error) {
      next(error);
    }
  }

  async getNearByVipTrips(req: Request, res: Response, next: NextFunction) {
    try {
      const { gender } = req as CustomRequest;
      const trips = await tripService.getNearByVipTrips({
        ...req.query,
        gender,
      });
      response(res, 200, {
        status: true,
        message: 'Trips featched successfully',
        result: trips,
      });
    } catch (error) {
      next(error);
    }
  }

  async getNearByVipTripsByDistance(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { gender, lat, lng } = req as CustomRequest;
      const trips = await tripService.getNearByVipTrips({
        lat,
        lng,
        gender,
        distance: +req.query.distance!,
      });
      response(res, 200, {
        status: true,
        message: 'Trips featched successfully',
        result: trips,
      });
    } catch (error) {
      next(error);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, role, language } = req as CustomRequest;
      const trip = await tripService.getOne(+req.params.tripId, user, role);
      response(res, 200, {
        status: true,
        message: 'Trip featched successfully',
        result: serializeActiveTrip(trip, language, role),
      });
    } catch (error) {
      next(error);
    }
  }
}

const tripController = new TripController();
export default tripController;
