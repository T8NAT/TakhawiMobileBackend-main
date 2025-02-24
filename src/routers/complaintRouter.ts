import { Router } from 'express';
import complaintController from '../controllers/complaintController';
import joiMiddleWare from '../middlewares/joiMiddleware';
import {
  createComplaintValidations,
  updateComplaintValidations,
} from '../validations/complaintValidations';
import auth from '../middlewares/auth';

const router = Router();

router.use(auth);

router
  .route('/')
  .get(complaintController.getAll)
  .post(joiMiddleWare(createComplaintValidations), complaintController.create);

router
  .route('/:id')
  .get(complaintController.getOne)
  .patch(joiMiddleWare(updateComplaintValidations), complaintController.update)
  .delete(complaintController.delete);

export default router;
