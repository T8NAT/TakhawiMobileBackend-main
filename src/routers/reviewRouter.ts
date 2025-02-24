import { Router } from 'express';
import reviewController from '../controllers/reviewController';
import {
  createReviewValidation,
  reviewTypeQueryValidation,
} from '../validations/reviewValidations';
import joiMiddleWare from '../middlewares/joiMiddleware';
import auth from '../middlewares/auth';
import authorization from '../middlewares/authorization';
import { Roles } from '../enum/roles';

const router = Router();

router.use(auth);

router.post(
  '/driver',
  authorization(Roles.USER),
  joiMiddleWare(createReviewValidation),
  reviewController.createDriverReview,
);

router.post(
  '/passenger',
  authorization(Roles.DRIVER),
  joiMiddleWare(createReviewValidation),
  reviewController.createPassengerReview,
);

router.get('/my-reviews', reviewController.getMyReviews);

router.get('/target/:target_id', reviewController.getReviewsByTargetId);

router.get('/:id', reviewController.getOne);

router.get(
  '/',
  authorization(Roles.ADMIN, Roles.SUPER_ADMIN),
  joiMiddleWare(reviewTypeQueryValidation, 'query'),
  reviewController.getAll,
);

export default router;
