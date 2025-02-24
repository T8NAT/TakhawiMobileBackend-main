import Joi from 'joi';
import { CreateUserBillingInfo } from '../types/paymentGatewayType';

export const createUserBillingInfoValidation =
  Joi.object<CreateUserBillingInfo>().keys({
    cityId: Joi.number().strict().required(),
    state: Joi.string().required(),
    street: Joi.string().required(),
    surname: Joi.string().required(),
  });
