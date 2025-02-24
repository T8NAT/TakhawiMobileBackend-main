import Joi from 'joi';
import {
  CreateVehicle,
  UpdateVehicle,
  VehicleQueryType,
} from '../types/vehicleType';

export const createVehicleValidation = Joi.object<CreateVehicle>().keys({
  serial_no: Joi.string().required(),
  plate_alphabet: Joi.string().min(1).max(3).required(),
  plate_alphabet_ar: Joi.string().min(1).required(),
  plate_number: Joi.string().min(1).max(4).required(),
  seats_no: Joi.number().min(1).max(7).required(),
  production_year: Joi.number().min(1950).required(),
  vehicle_class_id: Joi.number().required(),
  vehicle_color_id: Joi.number().required(),
  vehicle_type_id: Joi.number().required(),
  vehicle_name_id: Joi.number().required(),
});

export const updateVehicleValidation = Joi.object<UpdateVehicle>().keys({
  serial_no: Joi.string().optional(),
  plate_alphabet: Joi.string().min(1).max(3).optional(),
  plate_alphabet_ar: Joi.string().min(1).optional(),
  plate_number: Joi.string().min(1).max(4).optional(),
  seats_no: Joi.number().min(1).max(7).optional(),
  production_year: Joi.number().min(1950).optional(),
  vehicle_class_id: Joi.number().optional(),
  vehicle_color_id: Joi.number().optional(),
  vehicle_type_id: Joi.number().optional(),
  vehicle_name_id: Joi.number().optional(),
});

export const VehicleQueryTypeValidation = Joi.object<VehicleQueryType>().keys({
  page: Joi.number().optional(),
  limit: Joi.number().optional(),
  production_year: Joi.number().optional(),
  seats_no: Joi.number().optional(),
});
