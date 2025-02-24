import { Router } from 'express';
import addressController from '../controllers/addressController';
import {
  createAddressValidation,
  updateAddressValidation,
} from '../validations/addressValidations';
import joiMiddleWare from '../middlewares/joiMiddleware';
import auth from '../middlewares/auth';
import authorization from '../middlewares/authorization';
import { Roles } from '../enum/roles';

const router = Router();

router.use(auth);

router
  .route('/')
  .post(joiMiddleWare(createAddressValidation), addressController.create)
  .get(addressController.getAll);

router
  .route('/all')
  .get(
    authorization(Roles.SUPER_ADMIN, Roles.ADMIN),
    addressController.getAllAddresses,
  );

router
  .route('/:id')
  .get(addressController.getOne)
  .put(joiMiddleWare(updateAddressValidation), addressController.update)
  .delete(addressController.delete);

export default router;
