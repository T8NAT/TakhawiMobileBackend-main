import { Router } from 'express';
import walletController from '../controllers/walletControoler';
import auth from '../middlewares/auth';
import joiMiddleWare from '../middlewares/joiMiddleware';
import {
  rechargeWalletSchema,
  walletTransactionsQuerySchema,
} from '../validations/walletValidations';
import authorization from '../middlewares/authorization';
import { Roles } from '../enum/roles';

const router = Router();

router.use(auth);

router.get(
  '/user-transactions',
  authorization(Roles.USER),
  joiMiddleWare(walletTransactionsQuerySchema, 'query'),
  walletController.getUserWalletHistory,
);

router.get(
  '/driver-transactions',
  authorization(Roles.DRIVER),
  joiMiddleWare(walletTransactionsQuerySchema, 'query'),
  walletController.getDriverWalletHistory,
);

router.post(
  '/recharge',
  authorization(Roles.USER),
  joiMiddleWare(rechargeWalletSchema),
  walletController.walletRecharge,
);

export default router;
