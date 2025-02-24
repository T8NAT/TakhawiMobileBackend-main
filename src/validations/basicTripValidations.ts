import Joi from 'joi';
import moment from 'moment';
import {
  BasicTripQueryType,
  CalculateTripPrice,
  CancelBasicTrip,
  CreateBasicTrip,
  JoinBasicTripType,
} from '../types/basicTripType';
import { PaymentMethod } from '../enum/payment';
import { Features } from '../enum/features';
import { TripCancelationReason, TripSorting } from '../enum/trip';

export const createBasicTripValidation = Joi.object<CreateBasicTrip>().keys({
  start_date: Joi.date()
    .iso()
    .min(moment().add(1, 'h').toDate())
    .required()
    .messages({
      'date.base': 'Start date must be an iso date.',
      'date.min': 'Start date must be after the current date.',
      'any.required': 'Start date is required.',
    }),
  end_date: Joi.date().iso().min(Joi.ref('start_date')).required().messages({
    'date.base': 'End date must be an iso date.',
    'date.min': 'End date must be after the start date.',
    'any.required': 'End date is required.',
  }),
  seats_no: Joi.number().min(1).max(7).required(),
  available_seats_no: Joi.number().default(Joi.ref('seats_no')),
  price_per_seat: Joi.number().min(1).required(),
  destination_id: Joi.number().strict().required(),
  pickup_location_id: Joi.number().strict().required(),
  distance: Joi.number().strict().optional(),
  features: Joi.array()
    .items(Joi.string().valid(...Object.values(Features)))
    .required()
    .messages({
      'array.base': 'Features must be an array.',
      'any.required': 'Features is required.',
      'any.only': `Features must be one of: ${Object.values(Features).join(', ')}.`,
    }),
});

export const joinBasicTripValidation = Joi.object<JoinBasicTripType>().keys({
  payment_method: Joi.string()
    .valid(...Object.values(PaymentMethod))
    .required(),
  trip_id: Joi.number().strict().required(),
  coupon: Joi.string().optional(),
  card_id: Joi.when('payment_method', {
    is: PaymentMethod.CARD,
    then: Joi.number().strict().required(),
    otherwise: Joi.forbidden(),
  }),
});

export const CancelBasicTripValidation = Joi.object<CancelBasicTrip>().keys({
  note: Joi.string().optional(),
  reason: Joi.string()
    .valid(...Object.values(TripCancelationReason))
    .required(),
});

export const CancelPassengerTripValidation = Joi.object<CancelBasicTrip>().keys(
  {
    note: Joi.string().optional(),
    reason: Joi.string()
      .valid(...Object.values(TripCancelationReason))
      .required(),
    trip_id: Joi.number().strict().required(),
  },
);

export const basicTripQueryTypeValidation =
  Joi.object<BasicTripQueryType>().keys({
    cityPickupId: Joi.number().required(),
    destinationLat: Joi.number().required(),
    destinationLng: Joi.number().required(),
    startDate: Joi.date().iso().required(),
    sortBy: Joi.string().valid(...Object.values(TripSorting)),
    limit: Joi.number().optional(),
    page: Joi.number().optional(),
  });

export const calculateTripPriceValidation =
  Joi.object<CalculateTripPrice>().keys({
    coupon: Joi.string().optional(),
  });
