import { Router } from 'express';
import auth from '../middlewares/auth';
import warningController from '../controllers/warningController';
import {
  createWarningSchema,
  getWarningQuerySchema,
} from '../validations/warningValidtions';
import joiMiddleWare from '../middlewares/joiMiddleware';

const router = Router();

router.get('/:id', auth, warningController.getOne);
router
  .route('/')
  .post(joiMiddleWare(createWarningSchema), auth, warningController.create)
  .get(joiMiddleWare(getWarningQuerySchema, 'query'), warningController.getAll);
router.delete('/:id', auth, warningController.delete);

export default router;
