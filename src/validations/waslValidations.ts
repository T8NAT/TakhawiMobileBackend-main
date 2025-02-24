import Joi from 'joi';
import { CreateWaslTrip } from '../types/waslType';

export const createDriverandVehicleRegistrationSchema = Joi.object().keys({
  userId: Joi.number().optional(),
});

export const createTripRegistrationSchema = Joi.object<CreateWaslTrip>().keys({
  sequenceNumber: Joi.string().required(),
  driverId: Joi.string().required(),
  tripId: Joi.number().strict().required(),
  distanceInMeters: Joi.number().strict().required(),
  durationInSeconds: Joi.number().strict().required(),
  customerRating: Joi.number().strict().required(),
  customerWaitingTimeInSeconds: Joi.number().strict().required(),
  originLatitude: Joi.number().strict().required(),
  originLongitude: Joi.number().strict().required(),
  destinationLatitude: Joi.number().strict().required(),
  destinationLongitude: Joi.number().strict().required(),
  pickupTimestamp: Joi.date().iso().required(),
  dropoffTimestamp: Joi.date().iso().required(),
  startedWhen: Joi.date().iso().required(),
  tripCost: Joi.number().strict().required(),
});
