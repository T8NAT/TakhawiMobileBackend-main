import { Router } from 'express';
import auth from '../middlewares/auth';
import authorization from '../middlewares/authorization';
import { Roles } from '../enum/roles';
import pdfReportController from '../controllers/pdfReportController';
import joiMiddleWare from '../middlewares/joiMiddleware';
import { pdfReportValidations } from '../validations/pdfReportValidations';

const router = Router();

router.use(auth);
router.get(
  '/driver/:tripId',
  authorization(Roles.DRIVER),
  joiMiddleWare(pdfReportValidations, 'query'),
  pdfReportController.generateDriverTripReportPdf,
);

router.get(
  '/user/:tripId',
  authorization(Roles.USER),
  joiMiddleWare(pdfReportValidations, 'query'),
  pdfReportController.generateUserTripReportPdf,
);

export default router;
