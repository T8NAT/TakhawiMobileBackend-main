import Joi from 'joi';
import {
  AcceptOffer,
  CreateOffer,
  CreateVipTrip,
  CancelTrip,
} from '../types/vipTripType.d';
import { PaymentMethod } from '../enum/payment';
import { Features } from '../enum/features';
import { TripCancelationReason } from '../enum/trip';

export const createVipTripSchema = Joi.object<CreateVipTrip>().keys({
  start_date: Joi.date().iso().required(),
  destination_location_lat: Joi.number().strict().required(),
  destination_location_lng: Joi.number().strict().required(),
  pickup_description: Joi.string().required(),
  pickup_location_lat: Joi.number().strict().required(),
  pickup_location_lng: Joi.number().strict().required(),
  destination_description: Joi.string().required(),
  distance: Joi.number().strict().optional(),
  features: Joi.array()
    .items(Joi.string().valid(...Object.values(Features)))
    .required(),
});

export const createOfferSchema = Joi.object<CreateOffer>().keys({
  price: Joi.number().strict().required(),
  features: Joi.array()
    .items(Joi.string().valid(...Object.values(Features)))
    .required(),
});

export const acceptOfferSchema = Joi.object<AcceptOffer>().keys({
  payment_method: Joi.string()
    .valid(...Object.values(PaymentMethod))
    .required(),
  coupon: Joi.string().optional(),
  card_id: Joi.when('payment_method', {
    is: PaymentMethod.CARD,
    then: Joi.number().strict().required(),
    otherwise: Joi.forbidden(),
  }),
});

export const cancelTripSchema = Joi.object<CancelTrip>().keys({
  reason: Joi.string()
    .valid(...Object.values(TripCancelationReason))
    .required(),
  note: Joi.string().optional(),
});
