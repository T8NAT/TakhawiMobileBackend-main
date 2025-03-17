import Joi from 'joi';
import { CreateVehicleDetail } from '../types/vehicleDetailsType';
export declare const CreateVehicleDetailValidation: Joi.ObjectSchema<CreateVehicleDetail>;
export declare const UpdateVehicleDetailValidation: Joi.ObjectSchema<Partial<CreateVehicleDetail>>;
export declare const vehicleProductionStartYearValidation: Joi.ObjectSchema<any>;
