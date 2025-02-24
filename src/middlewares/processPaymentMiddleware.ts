import { Request, Response, NextFunction } from 'express';
import CustomRequest from '../interfaces/customRequest';
import tripService from '../services/tripService';
import { CalculateTripPrice } from '../types/tripType';
import { TripType } from '../enum/trip';
import { PaymentFactory } from '../strategies/PaymentFactory';
import { PaymentInputType } from '../types/paymentGatewayType';

export const processPaymentMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { user: userId } = req as CustomRequest;
    const { offer_id } = req.params;
    const { payment_method, trip_id, card_id, coupon } = req.body;
    const tripOrOfferId = +(trip_id || offer_id);

    // Calculate trip price
    const data: CalculateTripPrice = {
      id: tripOrOfferId,
      coupon,
      passenger_id: userId,
      type: trip_id ? TripType.BASICTRIP : TripType.VIPTRIP,
    };
    const tripPriceBreakdown = await tripService.calculateTripPrice(data);
    console.log('tripPriceBreakdown', tripPriceBreakdown);
    // Select payment strategy based on paymentMethod
    const paymentContext = PaymentFactory.createPaymentContext(payment_method);
    const paymentData: PaymentInputType = {
      amount: tripPriceBreakdown.total_price,
      userId,
      tripOrOfferId,
      cardId: card_id,
      type: trip_id ? TripType.BASICTRIP : TripType.VIPTRIP,
    };

    // Process payment using the selected strategy
    const paymentResponse = await paymentContext.processPayment(paymentData);
    req.body.tripPriceBreakdown = tripPriceBreakdown;
    req.body.paymentHtml =
      paymentResponse && paymentResponse.html
        ? paymentResponse.html
        : undefined;
    req.body.transactionId =
      paymentResponse && paymentResponse.transactionId
        ? paymentResponse.transactionId
        : undefined;
    req.body.path =
      paymentResponse && paymentResponse.path
        ? paymentResponse.path
        : undefined;
    req.body.checkOutId =
      paymentResponse && paymentResponse.checkOutId
        ? paymentResponse.checkOutId
        : undefined;

    next();
  } catch (error) {
    next(error);
  }
};
