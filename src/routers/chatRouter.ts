import { Router } from 'express';
import chatController from '../controllers/chatController';
import auth from '../middlewares/auth';
import { Roles } from '../enum/roles';
import authorization from '../middlewares/authorization';
import joiMiddleWare from '../middlewares/joiMiddleware';
import { openChatSchema } from '../validations/chatValidations';

const router = Router();

router.use(auth, authorization(Roles.USER, Roles.DRIVER));

router.post(
  '/open-chat',
  joiMiddleWare(openChatSchema),
  chatController.openChat,
);

router.get('/', chatController.getAll);

export default router;
