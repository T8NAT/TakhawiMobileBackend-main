import { Router } from 'express';

import vehicleController from '../controllers/vehicleController';
import joiMiddleWare from '../middlewares/joiMiddleware';
import {
  createVehicleValidation,
  updateVehicleValidation,
  VehicleQueryTypeValidation,
} from '../validations/vehicleValidations';
import auth from '../middlewares/auth';
import authorization from '../middlewares/authorization';
import { Roles } from '../enum/roles';
import uploadToDiskStorage from '../middlewares/multer';
import {
  validateMulterType,
  validateMulterArray,
  validateMulterManyFilesType,
} from '../middlewares/multerTypeValidation';
import { VehicleImageType } from '../enum/vehicle';

const router = Router();

router.use(auth);
// Role here like SUPER_ADMIN will change based on business logic
router
  .route('/')
  .post(
    authorization(Roles.DRIVER),
    joiMiddleWare(createVehicleValidation),
    vehicleController.create,
  )
  .get(
    authorization(Roles.SUPER_ADMIN),
    joiMiddleWare(VehicleQueryTypeValidation, 'query'),
    vehicleController.getAll,
  );

router
  .use(authorization(Roles.SUPER_ADMIN, Roles.DRIVER))
  .route('/:id')
  .get(vehicleController.getOne)
  .patch(joiMiddleWare(updateVehicleValidation), vehicleController.update)
  .delete(vehicleController.delete);

router.use(authorization(Roles.DRIVER));

router.post(
  '/upload-images',
  uploadToDiskStorage.array('file_path', 4),
  validateMulterArray(['jpeg', 'png', 'jpg', 'pdf'], 4, 4, true),
  vehicleController.uploadVehicleImages,
);

router.post(
  '/licence-images',
  uploadToDiskStorage.array('file_path', 2),
  validateMulterArray(['jpeg', 'png', 'jpg', 'pdf'], 2, 2, true),
  vehicleController.uploadVehicleLicence,
);

router.post(
  '/insurance-image',
  uploadToDiskStorage.single('file_path'),
  validateMulterType(['jpeg', 'png', 'jpg', 'pdf']),
  vehicleController.uploadVehicleInsurance,
);

router.post(
  '/add-new-vehicle',
  uploadToDiskStorage.fields([
    { name: VehicleImageType.INSURANCE, maxCount: 1 },
    { name: VehicleImageType.LICENCE, maxCount: 2 },
    { name: VehicleImageType.VEHICLE, maxCount: 4 },
  ]),
  validateMulterManyFilesType([
    {
      name: VehicleImageType.INSURANCE,
      maxCount: 1,
      minCount: 1,
      isFilesRequired: true,
      acceptedFiles: ['jpeg', 'jpg', 'png', 'pdf'],
    },
    {
      name: VehicleImageType.LICENCE,
      maxCount: 2,
      minCount: 2,
      isFilesRequired: true,
      acceptedFiles: ['jpeg', 'jpg', 'png', 'pdf'],
    },
    {
      name: VehicleImageType.VEHICLE,
      maxCount: 4,
      minCount: 4,
      isFilesRequired: true,
      acceptedFiles: ['jpeg', 'jpg', 'png', 'pdf'],
    },
  ]),
  joiMiddleWare(createVehicleValidation),
  vehicleController.addNewVehicle,
);

export default router;
