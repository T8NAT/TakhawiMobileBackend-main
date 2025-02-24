import { Router } from 'express';
import issueController from '../controllers/issueController';
import joiMiddleWare from '../middlewares/joiMiddleware';
import {
  createIssueValidation,
  updateIssueValidation,
  issueTypeQueryValidation,
} from '../validations/issueValidations';
import auth from '../middlewares/auth';

const router = Router();

router.use(auth);

router
  .route('/')
  .post(joiMiddleWare(createIssueValidation), issueController.create)
  .get(
    joiMiddleWare(issueTypeQueryValidation, 'query'),
    issueController.getAll,
  );

router
  .route('/:id')
  .get(issueController.getOne)
  .patch(joiMiddleWare(updateIssueValidation), issueController.update)
  .delete(issueController.delete);

export default router;
