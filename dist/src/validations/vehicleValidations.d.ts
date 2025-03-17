import Joi from 'joi';
import { CreateVehicle, UpdateVehicle, VehicleQueryType } from '../types/vehicleType';
export declare const createVehicleValidation: Joi.ObjectSchema<CreateVehicle>;
export declare const updateVehicleValidation: Joi.ObjectSchema<UpdateVehicle>;
export declare const VehicleQueryTypeValidation: Joi.ObjectSchema<VehicleQueryType>;
