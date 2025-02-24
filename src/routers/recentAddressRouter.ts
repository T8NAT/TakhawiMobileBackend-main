import { Router } from 'express';
import recentAddressController from '../controllers/recentAddressController';
import auth from '../middlewares/auth';
import joiMiddleWare from '../middlewares/joiMiddleware';
import { createRecentAddressSchema } from '../validations/recentAddressValidations';

const recentAddressRouter = Router();

recentAddressRouter
  .route('/')
  .post(
    auth,
    joiMiddleWare(createRecentAddressSchema),
    recentAddressController.create,
  )
  .get(auth, recentAddressController.getAll);

recentAddressRouter.delete('/:id', auth, recentAddressController.delete);

export default recentAddressRouter;
