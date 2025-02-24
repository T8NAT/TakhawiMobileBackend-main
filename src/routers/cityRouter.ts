import { Router } from 'express';
import cityController from '../controllers/cityController';
import joiMiddleWare from '../middlewares/joiMiddleware';
import {
  createCityValidations,
  updateCityValidations,
} from '../validations/cityValidations';

const router = Router();

router
  .route('/')
  .get(cityController.getAll)
  .post(joiMiddleWare(createCityValidations), cityController.create);

router
  .route('/:id')
  .get(cityController.getOne)
  .patch(joiMiddleWare(updateCityValidations), cityController.update)
  .delete(cityController.delete);

export default router;
