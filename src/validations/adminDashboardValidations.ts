import Joi from 'joi';
import { UserTransactionsQueryType } from '../types/adminDashboardService';
import { TransactionType } from '../enum/wallet';

export const userTransactionsQueryValidation =
  Joi.object<UserTransactionsQueryType>().keys({
    transaction_type: Joi.string().valid(...Object.values(TransactionType)),
    user_id: Joi.number(),
    limit: Joi.number(),
    page: Joi.number(),
  });
