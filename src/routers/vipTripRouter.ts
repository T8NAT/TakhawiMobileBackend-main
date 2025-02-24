import { Router } from 'express';
import vipTripController from '../controllers/vipTripController';
import auth from '../middlewares/auth';
import authorization from '../middlewares/authorization';
import joiMiddleWare from '../middlewares/joiMiddleware';
import {
  createVipTripSchema,
  acceptOfferSchema,
  createOfferSchema,
  cancelTripSchema,
} from '../validations/vipTripValidations';
import { Roles } from '../enum/roles';
import { processPaymentMiddleware } from '../middlewares/processPaymentMiddleware';
import offerController from '../controllers/offerController';

const router = Router();

router.use(auth);

router.post(
  '/',
  joiMiddleWare(createVipTripSchema),
  authorization(Roles.USER),
  vipTripController.create,
);

router.get('/offers/:trip_id', vipTripController.getTripOffers);

router.get('/:id', vipTripController.getOne);

router.delete(
  '/:trip_id',
  authorization(Roles.USER),
  joiMiddleWare(cancelTripSchema),
  vipTripController.cancel,
);

router.post(
  '/make-offer/:trip_id',
  authorization(Roles.DRIVER),
  joiMiddleWare(createOfferSchema),
  offerController.makeOffer,
);

router.post(
  '/accept-offer/:offer_id',
  authorization(Roles.USER),
  joiMiddleWare(acceptOfferSchema),
  processPaymentMiddleware,
  offerController.acceptOffer,
);

router.delete(
  '/reject-offer/:offer_id',
  authorization(Roles.USER),
  offerController.rejectOffer,
);

router.delete(
  '/cancel-by-driver/:trip_id',
  authorization(Roles.DRIVER),
  joiMiddleWare(cancelTripSchema),
  vipTripController.driverCancelation,
);

router.patch(
  '/end-trip/:trip_id',
  authorization(Roles.DRIVER),
  vipTripController.endTrip,
);

router.post('/calculate-price/:offerId', offerController.calculateOfferPrice);
export default router;
