import { Router } from 'express';
import basicTripController from '../controllers/basicTripController';
import auth from '../middlewares/auth';
import authorization from '../middlewares/authorization';
import { Roles } from '../enum/roles';
import { joiAsyncMiddleWare } from '../middlewares/joiMiddleware';
import {
  CancelBasicTripValidation,
  CancelPassengerTripValidation,
  basicTripQueryTypeValidation,
  calculateTripPriceValidation,
  createBasicTripValidation,
  joinBasicTripValidation,
} from '../validations/basicTripValidations';
import { checkAvailableReserve } from '../middlewares/checkAvailableReserve';
import { checkAvailableDriverMakeTrip } from '../middlewares/checkAvailableDriverMakeTrip';
import { processPaymentMiddleware } from '../middlewares/processPaymentMiddleware';

const router = Router();

router.get('/apple-pay/join/:transactionId', basicTripController.applepayJoin);

router.use(auth);

router.post(
  '/',
  authorization(Roles.DRIVER),
  joiAsyncMiddleWare(createBasicTripValidation),
  checkAvailableDriverMakeTrip,
  basicTripController.create,
);

router.get('/:tripId', authorization(Roles.USER), basicTripController.get);

router.get(
  '/',
  authorization(Roles.USER),
  joiAsyncMiddleWare(basicTripQueryTypeValidation, 'query'),
  basicTripController.getAll,
);

router.post(
  '/join',
  authorization(Roles.USER),
  joiAsyncMiddleWare(joinBasicTripValidation),
  checkAvailableReserve,
  processPaymentMiddleware,
  basicTripController.join,
);

router.delete(
  '/cancel-by-driver/:tripId',
  authorization(Roles.DRIVER),
  joiAsyncMiddleWare(CancelBasicTripValidation),
  basicTripController.cancelBYDriver,
);

router.delete(
  '/cancel-by-passenger/:passengerTripId',
  authorization(Roles.USER),
  joiAsyncMiddleWare(CancelPassengerTripValidation),
  basicTripController.cancelByPassenger,
);

router.patch(
  '/end-trip/:tripId',
  authorization(Roles.DRIVER),
  basicTripController.endTrip,
);

router.post(
  '/calculate-price/:tripId',
  authorization(Roles.USER),
  joiAsyncMiddleWare(calculateTripPriceValidation, 'body'),
  basicTripController.calculateTripPrice,
);

router.patch(
  '/mark-as-arrived/:passengerTripId',
  authorization(Roles.DRIVER),
  basicTripController.markPassengerAsArrived,
);

export default router;
