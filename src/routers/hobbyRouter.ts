import { Router } from 'express';
import hobbyController from '../controllers/hobbyController';
import joiMiddleWare from '../middlewares/joiMiddleware';
import {
  createHobbyValidations,
  updateHobbyValidations,
} from '../validations/hobbyValidations';

const router = Router();

router
  .route('/')
  .get(hobbyController.getAll)
  .post(joiMiddleWare(createHobbyValidations), hobbyController.create);

router
  .route('/:id')
  .get(hobbyController.getOne)
  .put(joiMiddleWare(updateHobbyValidations), hobbyController.update)
  .delete(hobbyController.delete);

export default router;
