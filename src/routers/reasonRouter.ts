import { Router } from 'express';
import ReasonController from '../controllers/reasonController';
import authorization from '../middlewares/authorization';
import joiMiddleWare from '../middlewares/joiMiddleware';
import {
  createReasonValidation,
  updateReasonValidation,
} from '../validations/reasonValidations';
import { Roles } from '../enum/roles';
import auth from '../middlewares/auth';

const router = Router();

router.use(auth);

router.get('/', ReasonController.getAll);

router.use(authorization(Roles.SUPER_ADMIN, Roles.ADMIN));

router
  .route('/')
  .post(joiMiddleWare(createReasonValidation), ReasonController.create);

router
  .route('/:id')
  .get(ReasonController.getOne)
  .patch(joiMiddleWare(updateReasonValidation), ReasonController.update)
  .delete(ReasonController.delete);

export default router;
