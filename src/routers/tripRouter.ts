import { Router } from 'express';
import tripController from '../controllers/tripController';
import auth from '../middlewares/auth';
import authorization from '../middlewares/authorization';
import { Roles } from '../enum/roles';
import joiMiddleWare from '../middlewares/joiMiddleware';
import {
  getNearByVipTripsByDistanceSchema,
  nearByVipTripsSchema,
  tripQueryTypeValidation,
  updateTripStatusSchema,
} from '../validations/tripValidations';

const router = Router();

router.use(auth);

router.get('/completed-trips', tripController.getCompletedTrips);

router.get('/cancelled-trips', tripController.getCancelledTrips);

router.get('/upcoming-trips', tripController.getUpcomingTrips);

router.get(
  '/nearby-vip-trips',
  joiMiddleWare(nearByVipTripsSchema, 'query'),
  tripController.getNearByVipTrips,
);

router.get(
  '/nearby-by-distance',
  joiMiddleWare(getNearByVipTripsByDistanceSchema, 'query'),
  tripController.getNearByVipTripsByDistance,
);

router.get('/:tripId', tripController.getOne);

router.get(
  '/',
  authorization(Roles.ADMIN, Roles.SUPER_ADMIN),
  joiMiddleWare(tripQueryTypeValidation, 'query'),
  tripController.getTrips,
);

router.patch(
  '/trip-status/:tripId',
  joiMiddleWare(updateTripStatusSchema),
  tripController.updateTripStatus,
);

export default router;
