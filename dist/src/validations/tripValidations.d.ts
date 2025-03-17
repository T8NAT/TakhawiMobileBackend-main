import Joi from 'joi';
import { TripQueryType } from '../types/tripType';
export declare const tripQueryTypeValidation: Joi.ObjectSchema<TripQueryType>;
export declare const updateTripStatusSchema: Joi.ObjectSchema<any>;
export declare const nearByVipTripsSchema: Joi.ObjectSchema<Partial<import("../types/queryType").QueryType & {
    lat: number;
    lng: number;
    gender: string;
    distance: number;
}>>;
export declare const getNearByVipTripsByDistanceSchema: Joi.ObjectSchema<Partial<import("../types/queryType").QueryType & {
    lat: number;
    lng: number;
    gender: string;
    distance: number;
}>>;
export declare const noOfMonthValidation: Joi.ObjectSchema<any>;
