import { Router } from 'express';
import settlementRequestController from '../controllers/settlementRequestController';
import auth from '../middlewares/auth';
import authorization from '../middlewares/authorization';
import joiMiddleWare from '../middlewares/joiMiddleware';
import {
  createSettlementRequestSchema,
  settlementRequestQuerySchema,
} from '../validations/settlementRequestValidations';
import { Roles } from '../enum/roles';

const router = Router();

router.use(auth);

router
  .route('/')
  .post(
    authorization(Roles.DRIVER),
    joiMiddleWare(createSettlementRequestSchema),
    settlementRequestController.create,
  )
  .get(
    authorization(Roles.SUPER_ADMIN, Roles.ADMIN),
    joiMiddleWare(settlementRequestQuerySchema, 'query'),
    settlementRequestController.getAll,
  );

router
  .route('/:id')
  .get(
    authorization(Roles.SUPER_ADMIN, Roles.ADMIN, Roles.DRIVER),
    settlementRequestController.getOne,
  )
  .delete(authorization(Roles.DRIVER), settlementRequestController.cancel);

router.patch(
  '/approve/:id',
  authorization(Roles.SUPER_ADMIN, Roles.ADMIN),
  settlementRequestController.approve,
);

router.patch(
  '/deny/:id',
  authorization(Roles.SUPER_ADMIN, Roles.ADMIN),
  settlementRequestController.deny,
);

export default router;
