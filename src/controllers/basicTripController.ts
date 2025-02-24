import { Request, Response, NextFunction } from 'express';
import pug from 'pug';
import response from '../utils/response';
import basicTripService from '../services/basicTripService';
import CustomRequest from '../interfaces/customRequest';
import { basicTripSerialization } from '../utils/serialization/basicTrip.serialization';
import { customEventEmitter } from '../utils/event-listner';
import { PaymentMethod } from '../enum/payment';

class BasicTripController {
  async applepayJoin(req: Request, res: Response) {
    try {
      const { transactionId } = req.params;
      await basicTripService.applepayJoin(transactionId);
      const html = pug.renderFile('./src/templates/paymentResponse.pug', {
        status: true,
      });
      res.send(html);
    } catch (error: any) {
      const html = pug.renderFile('./src/templates/paymentResponse.pug', {
        status: false,
        errorMessage: error.message,
      });
      res.send(html);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, gender } = req as CustomRequest;
      const trip = await basicTripService.create(req.body, user, gender);
      response(res, 201, {
        status: true,
        message: 'Basic Trip Created Successfully',
        result: trip,
      });
    } catch (error) {
      next(error);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, language } = req as CustomRequest;
      const { tripId } = req.params;
      const trip = await basicTripService.get(+tripId, user);
      response(res, 200, {
        status: true,
        message: 'Basic Trip Details Fetched Successfully',
        result: basicTripSerialization(trip, language),
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { gender, user, language } = req as CustomRequest;
      const trips = await basicTripService.getAll(
        user,
        language,
        gender,
        req.query,
      );
      response(res, 200, {
        status: true,
        message: 'Basic Trips Fetched Successfully',
        result: trips,
      });
    } catch (error) {
      next(error);
    }
  }

  async join(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req as CustomRequest;
      const trip = await basicTripService.join(
        { ...req.body, passenger_id: user },
        req.body.tripPriceBreakdown,
      );
      if (req.body.payment_method === PaymentMethod.APPLEPAY) {
        return response(res, 200, {
          status: true,
          message: 'Bassic trip seat on hold',
          result: {
            checkOutId: req.body.checkOutId,
          },
        });
      }
      response(res, 201, {
        status: true,
        message: 'Joined Basic Trip Successfully',
        result: trip,
      });
    } catch (error) {
      next(error);
    }
  }

  async cancelBYDriver(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req as CustomRequest;
      const { tripId } = req.params;
      const data = await basicTripService.cancelByDriver({
        trip_id: +tripId,
        user_id: user,
        ...req.body,
      });
      response(res, 200, {
        status: true,
        message: 'Basic Trip Cancelled Successfully',
      });
      if (data) customEventEmitter.emit('driverCancelation', data);
    } catch (error) {
      next(error);
    }
  }

  async cancelByPassenger(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req as CustomRequest;
      const { passengerTripId } = req.params;
      const data = await basicTripService.cancelByPassenger({
        passenger_trip_id: +passengerTripId,
        user_id: user,
        ...req.body,
      });
      response(res, 200, {
        status: true,
        message: 'Basic Trip Cancelled Successfully',
      });
      if (data) customEventEmitter.emit('userCancelation', data);
    } catch (error) {
      next(error);
    }
  }

  async endTrip(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req as CustomRequest;
      const { tripId } = req.params;
      const { tripStatusInfo, tripSummary } = await basicTripService.endTrip(
        +tripId,
        user,
      );
      response(res, 200, {
        status: true,
        message: 'Basic Trip Ended Successfully',
        result: tripSummary,
      });
      customEventEmitter.emit('tripStatusUpdate', tripStatusInfo);
      customEventEmitter.emit('endTrip', tripSummary);
    } catch (error) {
      next(error);
    }
  }

  async calculateTripPrice(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req as CustomRequest;
      const { tripId } = req.params;
      const price = await basicTripService.calculateTripPrice({
        ...req.body,
        trip_id: +tripId,
        passenger_id: user,
      });
      response(res, 200, {
        status: true,
        message: 'Trip Price Calculated Successfully',
        result: price,
      });
    } catch (error) {
      next(error);
    }
  }

  async markPassengerAsArrived(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      await basicTripService.markPassengerAsArrived(
        +req.params.passengerTripId,
      );
      response(res, 200, {
        status: true,
        message: 'Passenger Marked as Arrived Successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

const basicTripController = new BasicTripController();
export default basicTripController;
