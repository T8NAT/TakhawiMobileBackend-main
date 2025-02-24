import { Router } from 'express';
import auth from '../middlewares/auth';
import paymentGatewayController from '../controllers/paymentGatewayControler';
import joiMiddleWare from '../middlewares/joiMiddleware';
import { applepaySessionValidation } from '../validations/paymentGatewayValidations';

const router = Router();

router.get(
  '/apple-pay-session',
  joiMiddleWare(applepaySessionValidation, 'query'),
  paymentGatewayController.getApplePaySession,
);

router.get(
  '/initial-payment-status/:checkOutId/:userId',
  paymentGatewayController.getInitialPaymentStatus,
);
// TODO: for test only remove it later
router.get('/prepare-checkout', auth, paymentGatewayController.prepareCheckout);

export default router;
