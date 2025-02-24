import { Router } from 'express';
import auth from '../middlewares/auth';
import authorization from '../middlewares/authorization';
import { Roles } from '../enum/roles';
import driverReportController from '../controllers/driverReportController';
import { noOfMonthValidation } from '../validations/tripValidations';
import joiMiddleWare from '../middlewares/joiMiddleware';

const router = Router();

router.use(auth, authorization(Roles.DRIVER));

router.get('/', driverReportController.getDriverProfitReport);

router.get(
  '/monthly-profit',
  joiMiddleWare(noOfMonthValidation, 'query'),
  driverReportController.getDriverReportPerMonth,
);

router.get(
  '/financial-summary',
  driverReportController.getDriverFinancialSummary,
);

router.get('/:tripId/reviews', driverReportController.tripReviewReport);

router.get('/:tripId', driverReportController.getOneTripReport);

export default router;
