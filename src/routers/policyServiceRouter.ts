import { Router } from 'express';
import policyServiceController from '../controllers/policyServiceController';
import auth from '../middlewares/auth';
import authorization from '../middlewares/authorization';
import joiMiddleWare from '../middlewares/joiMiddleware';
import { Roles } from '../enum/roles';
import {
  createPolicyServiceValidation,
  updatePolicyServiceValidation,
} from '../validations/policyServiceValidations';

const router = Router();

router.get('/privacy-policy', policyServiceController.getPrivacyPolicy);
router.get(
  '/terms-and-conditions',
  policyServiceController.getTermsAndConditions,
);

router.use(auth, authorization(Roles.ADMIN, Roles.SUPER_ADMIN));

router
  .route('/privacy-policy')
  .post(
    joiMiddleWare(createPolicyServiceValidation),
    policyServiceController.createPrivacyPolicy,
  )
  .patch(
    joiMiddleWare(updatePolicyServiceValidation),
    policyServiceController.updatePrivacyPolicy,
  );

router
  .route('/terms-and-conditions')
  .post(
    joiMiddleWare(createPolicyServiceValidation),
    policyServiceController.createTermsAndConditions,
  )
  .patch(
    joiMiddleWare(updatePolicyServiceValidation),
    policyServiceController.updateTermsAndConditions,
  );
export default router;
