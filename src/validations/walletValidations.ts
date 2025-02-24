import Joi from 'joi';
import { TransactionType } from '../enum/wallet';
import { RechargeWallet } from '../types/walletType';

export const walletTransactionsQuerySchema = Joi.object().keys({
  page: Joi.number().optional(),
  limit: Joi.number().optional(),
  from: Joi.date().optional(),
  to: Joi.date().optional(),
  type: Joi.string()
    .valid(...Object.values(TransactionType))
    .optional(),
});

export const rechargeWalletSchema = Joi.object<RechargeWallet>().keys({
  amount: Joi.number().required(),
  cardId: Joi.number().required(),
});
