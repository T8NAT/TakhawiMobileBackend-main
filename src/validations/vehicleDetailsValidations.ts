import Joi from 'joi';
import {
  CreateVehicleDetail,
  UpdateVehicleDetail,
} from '../types/vehicleDetailsType';

export const CreateVehicleDetailValidation =
  Joi.object<CreateVehicleDetail>().keys({
    ar_name: Joi.string().required(),
    en_name: Joi.string().required(),
  });

export const UpdateVehicleDetailValidation =
  Joi.object<UpdateVehicleDetail>().keys({
    ar_name: Joi.string().optional(),
    en_name: Joi.string().optional(),
  });

export const vehicleProductionStartYearValidation = Joi.object().keys({
  start_year: Joi.number().strict().required(),
});
