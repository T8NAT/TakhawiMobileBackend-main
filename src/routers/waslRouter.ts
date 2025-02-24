import { Router } from 'express';
import auth from '../middlewares/auth';
import waslController from '../controllers/waslController';
import {
  createDriverandVehicleRegistrationSchema,
  createTripRegistrationSchema,
} from '../validations/waslValidations';
import joiMiddleWare from '../middlewares/joiMiddleware';
import authorization from '../middlewares/authorization';
import { Roles } from '../enum/roles';

const router = Router();

router.use(auth, authorization(Roles.DRIVER, Roles.ADMIN, Roles.SUPER_ADMIN));

router.post(
  '/',
  joiMiddleWare(createDriverandVehicleRegistrationSchema),
  waslController.createDriverandVehicleRegistration,
);
router.get(
  '/',
  joiMiddleWare(createDriverandVehicleRegistrationSchema, 'query'),
  waslController.getDriverandVehicleRegistration,
);

router.use(authorization(Roles.ADMIN, Roles.SUPER_ADMIN));
router.post(
  '/trip',
  joiMiddleWare(createTripRegistrationSchema),
  waslController.createTripRegistration,
);
router.get(
  '/trips-log',
  authorization(Roles.ADMIN, Roles.SUPER_ADMIN),
  waslController.getTripsLog,
);

export default router;
