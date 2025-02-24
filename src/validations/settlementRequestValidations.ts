import Joi from 'joi';
import {
  CreateSettlementRequest,
  SettlementRequestQuery,
} from '../types/settlementRequestType';
import { SettlementRequestStatus } from '../enum/settlementRequest';

export const createSettlementRequestSchema =
  Joi.object<CreateSettlementRequest>().keys({
    holder_name: Joi.string().required(),
    bank_name: Joi.string().required(),
    bank_account_number: Joi.string().required(),
    iban: Joi.string().required(),
    amount: Joi.number().strict().required(),
  });

export const settlementRequestQuerySchema =
  Joi.object<SettlementRequestQuery>().keys({
    page: Joi.number(),
    limit: Joi.number(),
    status: Joi.string().valid(...Object.values(SettlementRequestStatus)),
  });
