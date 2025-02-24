import { Router } from 'express';
import messageController from '../controllers/messageController';
import auth from '../middlewares/auth';
import { Roles } from '../enum/roles';
import authorization from '../middlewares/authorization';
import joiMiddleWare from '../middlewares/joiMiddleware';
import { sendMessageSchema } from '../validations/chatValidations';
import uploadToDiskStorage from '../middlewares/multer';
import { validateMulterType } from '../middlewares/multerTypeValidation';

const router = Router();

router.use(auth, authorization(Roles.USER, Roles.DRIVER));

router.post(
  '/send-message',
  uploadToDiskStorage.single('content'),
  validateMulterType(['jpeg', 'png', 'jpg'], true),
  joiMiddleWare(sendMessageSchema),
  messageController.sendMessage,
);

router.get('/:chatId', messageController.getAll);

router.patch('/:chatId', messageController.markAllAsRead);

export default router;
