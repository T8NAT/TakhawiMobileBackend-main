import { Router } from 'express';
import auth from '../middlewares/auth';
import authorization from '../middlewares/authorization';
import appConfigController from '../controllers/appConfigController';
import { Roles } from '../enum/roles';
import joiMiddleWare from '../middlewares/joiMiddleware';
import {
  appConfigQueryValidation,
  createAppConfigValidation,
} from '../validations/appConfigValidations';
import uploadToDiskStorage from '../middlewares/multer';

const router = Router();

router.use(auth, authorization(Roles.SUPER_ADMIN, Roles.ADMIN));

router
  .route('/')
  .get(
    joiMiddleWare(appConfigQueryValidation, 'query'),
    appConfigController.getAll,
  )
  .post(
    uploadToDiskStorage.single('value'),
    joiMiddleWare(createAppConfigValidation, 'body'),
    appConfigController.create,
  );

router.delete('/:id', appConfigController.delete);

export default router;
