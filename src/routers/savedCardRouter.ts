import { Router } from 'express';
import auth from '../middlewares/auth';
import savedCardController from '../controllers/savedCardController';
import { joiAsyncMiddleWare } from '../middlewares/joiMiddleware';
import { createUserBillingInfoValidation } from '../validations/savedCardValidations';
import authorization from '../middlewares/authorization';
import { Roles } from '../enum/roles';

const router = Router();

router.use(auth, authorization(Roles.USER));
router.post('/', savedCardController.create);
router.get('/', savedCardController.getAll);
router.delete('/:id', savedCardController.delete);
router.post(
  '/billing',
  joiAsyncMiddleWare(createUserBillingInfoValidation, 'body'),
  savedCardController.createUserBillingInfo,
);
router.get('/billing', savedCardController.getUserBillingInfo);

export default router;
