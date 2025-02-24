import { Router } from 'express';
import notificationController from '../controllers/notificationController';
import auth from '../middlewares/auth';
import joiMiddleWare from '../middlewares/joiMiddleware';
import {
  createNotificationSchema,
  sendNotificationSchema,
} from '../validations/notificationValidations';
import authorization from '../middlewares/authorization';
import { Roles } from '../enum/roles';

const router = Router();

router.use(auth);

router
  .route('/')
  .post(joiMiddleWare(createNotificationSchema), notificationController.create)
  .get(notificationController.getAll)
  .patch(notificationController.markAllAsRead);

router
  .route('/:id')
  .patch(notificationController.markAsRead)
  .delete(notificationController.delete);

router.post(
  '/send',
  authorization(Roles.ADMIN, Roles.SUPER_ADMIN),
  joiMiddleWare(sendNotificationSchema, 'body'),
  notificationController.sendNotification,
);

export default router;
