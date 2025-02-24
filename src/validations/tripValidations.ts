import Joi from 'joi';
import { TripQueryType, VipTripQueryType } from '../types/tripType';
import { TripStatus, TripType } from '../enum/trip';

export const tripQueryTypeValidation = Joi.object<TripQueryType>().keys({
  from: Joi.date().iso(),
  to: Joi.date().iso(),
  type: Joi.string().valid(...Object.values(TripType)),
  status: Joi.string().valid(...Object.values(TripStatus)),
  limit: Joi.number(),
  page: Joi.number(),
});

export const updateTripStatusSchema = Joi.object().keys({
  status: Joi.string()
    .valid(TripStatus.ON_WAY, TripStatus.ARRIVED, TripStatus.INPROGRESS)
    .required(),
});

export const nearByVipTripsSchema = Joi.object<VipTripQueryType>().keys({
  lat: Joi.number().required(),
  lng: Joi.number().required(),
});

export const getNearByVipTripsByDistanceSchema =
  Joi.object<VipTripQueryType>().keys({
    distance: Joi.number().required(),
  });

export const noOfMonthValidation = Joi.object().keys({
  noOfMonth: Joi.number().min(1).max(12).required(),
});
