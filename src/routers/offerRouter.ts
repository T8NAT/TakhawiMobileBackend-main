import { Router } from 'express';
import offerController from '../controllers/offerController';

const router = Router();

router.get(
  '/apple-pay/accept/:transactionId',
  offerController.applepayAcceptOffer,
);

export default router;
