import Joi from 'joi';
import { AcceptOffer, CreateOffer, CreateVipTrip, CancelTrip } from '../types/vipTripType.d';
export declare const createVipTripSchema: Joi.ObjectSchema<CreateVipTrip>;
export declare const createOfferSchema: Joi.ObjectSchema<CreateOffer>;
export declare const acceptOfferSchema: Joi.ObjectSchema<AcceptOffer>;
export declare const cancelTripSchema: Joi.ObjectSchema<CancelTrip>;
