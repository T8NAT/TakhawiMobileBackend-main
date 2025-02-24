import { Router } from 'express';
import promoCodeController from '../controllers/promoCodeController';
import joiMiddleWare from '../middlewares/joiMiddleware';
import {
  createPromoCodeValidations,
  updatePromoCodeValidations,
} from '../validations/promoCodeValidations';

const router = Router();

router.post('/check-code', promoCodeController.checkPromoCode);

router
  .route('/')
  .get(promoCodeController.getAll)
  .post(joiMiddleWare(createPromoCodeValidations), promoCodeController.create);

router
  .route('/:id')
  .get(promoCodeController.getOne)
  .patch(joiMiddleWare(updatePromoCodeValidations), promoCodeController.update)
  .delete(promoCodeController.delete);

export default router;
