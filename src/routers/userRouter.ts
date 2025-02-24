import { Router } from 'express';

import userController from '../controllers/userController';
import auth from '../middlewares/auth';
import uploadToDiskStorage from '../middlewares/multer';
import {
  createUserValidation,
  updateUserValidation,
  updateLocationSchema,
  updateUserStatusSchema,
  userQueryTypeSchema,
  fcmtokenSchema,
} from '../validations/userValidations';
import joiMiddleWare from '../middlewares/joiMiddleware';
import userManagementController from '../controllers/userManagementController';

const router = Router();
// TODO: Add authorization middleware to routes
router
  .route('/')
  .post(
    uploadToDiskStorage.single('avatar'),
    joiMiddleWare(createUserValidation),
    userController.create,
  )
  .get(joiMiddleWare(userQueryTypeSchema, 'query'), userController.getAll);

router.get('/drivers', userController.getDrivers);

router.use(auth);

router.get('/switch-to-driver', userManagementController.switchToDriver);

router.get('/switch-to-user', userManagementController.switchToUser);

router.patch(
  '/update-location',
  joiMiddleWare(updateLocationSchema),
  userManagementController.updateLocation,
);

router
  .route('/profile')
  .get(userController.getProfile)
  .patch(
    uploadToDiskStorage.single('avatar'),
    joiMiddleWare(updateUserValidation),
    userController.updateProfile,
  )
  .delete(userController.deleteProfile);

router.post(
  '/fcm-token',
  joiMiddleWare(fcmtokenSchema),
  userManagementController.createFCMToken,
);

router.patch(
  '/driver/status/:id',
  joiMiddleWare(updateUserStatusSchema),
  userManagementController.updateDriverStatus,
);

router.patch(
  '/passenger/status/:id',
  joiMiddleWare(updateUserStatusSchema),
  userManagementController.updatePassengerStatus,
);

router.get('/:id', userController.getOne);

export default router;
