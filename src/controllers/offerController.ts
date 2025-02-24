import { NextFunction, Request, Response } from 'express';
import pug from 'pug';
import offerService from '../services/offerService';
import CustomRequest from '../interfaces/customRequest';
import { customEventEmitter } from '../utils/event-listner';
import response from '../utils/response';
import { PaymentMethod } from '../enum/payment';

class OfferController {
  async makeOffer(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, gender } = req as CustomRequest;
      const { Trip, ...offer } = await offerService.makeOffer(
        +req.params.trip_id,
        gender,
        {
          ...req.body,
          driver_id: user,
        },
      );
      customEventEmitter.emit('newOffer', {
        roomId: Trip.Passnger.uuid,
        language: Trip.Passnger.prefered_language,
        offer,
        fcm_tokens: Trip.Passnger.User_FCM_Tokens,
      });
      response(res, 201, {
        status: true,
        message: 'Offer created successfully',
        result: offer,
      });
    } catch (error) {
      next(error);
    }
  }

  async acceptOffer(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req as CustomRequest;
      const offer = await offerService.acceptOffer(
        +req.params.offer_id,
        user,
        req.body,
      );
      if (req.body.payment_method === PaymentMethod.APPLEPAY) {
        return response(res, 200, {
          status: true,
          message: 'Offer on hold',
          result: {
            checkOutId: req.body.checkOutId,
          },
        });
      }
      response(res, 200, {
        status: true,
        message: 'Offer accepted successfully',
      });
      customEventEmitter.emit('offerAccepted', offer);
    } catch (error) {
      next(error);
    }
  }

  async rejectOffer(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req as CustomRequest;
      await offerService.rejectOffer(+req.params.offer_id, user);
      response(res, 200, {
        status: true,
        message: 'Offer rejected successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async applepayAcceptOffer(req: Request, res: Response) {
    try {
      const { transactionId } = req.params;
      const result = await offerService.applepayAcceptOffer(transactionId);
      const html = pug.renderFile('./src/templates/paymentResponse.pug', {
        status: true,
      });
      res.send(html);
      customEventEmitter.emit('offerAccepted', result);
    } catch (error: any) {
      const html = pug.renderFile('./src/templates/paymentResponse.pug', {
        status: false,
        errorMessage: error.message,
      });
      res.send(html);
    }
  }

  async calculateOfferPrice(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req as CustomRequest;
      const result = await offerService.calculateOfferPrice({
        ...req.body,
        offerId: +req.params.offerId,
        userId: user,
      });
      response(res, 200, {
        status: true,
        message: 'Price calculated successfully',
        result,
      });
    } catch (error) {
      next(error);
    }
  }
}

const offerController = new OfferController();
export default offerController;
