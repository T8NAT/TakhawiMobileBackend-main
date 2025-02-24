import { Router } from 'express';
import adminDashboardController from '../controllers/adminDashboardController';
import auth from '../middlewares/auth';
import authorization from '../middlewares/authorization';
import { Roles } from '../enum/roles';
import { joiAsyncMiddleWare } from '../middlewares/joiMiddleware';
import { userTransactionsQueryValidation } from '../validations/adminDashboardValidations';

const router = Router();

router.use(auth, authorization(Roles.SUPER_ADMIN, Roles.ADMIN));

router.get('/driver-statistics', adminDashboardController.getDriverStatistics);
router.get('/trip-statistics', adminDashboardController.getTripStatistics);
router.get(
  '/passenger-transactions',
  joiAsyncMiddleWare(userTransactionsQueryValidation, 'query'),
  adminDashboardController.getPassengerTransactions,
);
router.get(
  '/driver-transactions',
  joiAsyncMiddleWare(userTransactionsQueryValidation, 'query'),
  adminDashboardController.getDriverTransactions,
);
router.get('/earnings-report', adminDashboardController.generateEarningsReport);

export default router;
