import Joi from 'joi';
import { BasicTripQueryType, CalculateTripPrice, CancelBasicTrip, CreateBasicTrip, JoinBasicTripType } from '../types/basicTripType';
export declare const createBasicTripValidation: Joi.ObjectSchema<CreateBasicTrip>;
export declare const joinBasicTripValidation: Joi.ObjectSchema<JoinBasicTripType>;
export declare const CancelBasicTripValidation: Joi.ObjectSchema<CancelBasicTrip>;
export declare const CancelPassengerTripValidation: Joi.ObjectSchema<CancelBasicTrip>;
export declare const basicTripQueryTypeValidation: Joi.ObjectSchema<BasicTripQueryType>;
export declare const calculateTripPriceValidation: Joi.ObjectSchema<CalculateTripPrice>;
