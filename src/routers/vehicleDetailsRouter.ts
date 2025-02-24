import { Router } from 'express';
import vehicleDetailController from '../controllers/vehicleDetailsController';
import joiMiddleWare from '../middlewares/joiMiddleware';
import {
  CreateVehicleDetailValidation,
  UpdateVehicleDetailValidation,
  vehicleProductionStartYearValidation,
} from '../validations/vehicleDetailsValidations';
import auth from '../middlewares/auth';
import authorization from '../middlewares/authorization';
import { Roles } from '../enum/roles';
import { validateMulterType } from '../middlewares/multerTypeValidation';
import uploadToDiskStorage from '../middlewares/multer';

const router = Router();

router.use(auth);

router.route('/').get(vehicleDetailController.getAllVehicleDetails);

router
  .route('/production-start-year')
  .get(vehicleDetailController.getVehicleProductionStartYear)
  .post(
    authorization(Roles.ADMIN, Roles.SUPER_ADMIN),
    joiMiddleWare(vehicleProductionStartYearValidation),
    vehicleDetailController.createVehicleProductionStartYear,
  )
  .patch(
    authorization(Roles.ADMIN, Roles.SUPER_ADMIN),
    joiMiddleWare(vehicleProductionStartYearValidation),
    vehicleDetailController.updateVehicleProductionStartYear,
  );

router
  .route('/color')
  .get(vehicleDetailController.getVehicleColors)
  .post(
    authorization(Roles.ADMIN, Roles.SUPER_ADMIN),
    joiMiddleWare(CreateVehicleDetailValidation),
    vehicleDetailController.createVehicleColor,
  );

router
  .route('/color/:id')
  .get(vehicleDetailController.getVehicleColorById)
  .patch(
    authorization(Roles.ADMIN, Roles.SUPER_ADMIN),
    joiMiddleWare(UpdateVehicleDetailValidation),
    vehicleDetailController.updateVehicleColor,
  )
  .delete(
    authorization(Roles.ADMIN, Roles.SUPER_ADMIN),
    vehicleDetailController.deleteVehicleColor,
  );

router
  .route('/class')
  .get(vehicleDetailController.getVehicleClasses)
  .post(
    authorization(Roles.ADMIN, Roles.SUPER_ADMIN),
    joiMiddleWare(CreateVehicleDetailValidation),
    vehicleDetailController.createVehicleClass,
  );

router
  .route('/class/:id')
  .get(vehicleDetailController.getVehicleClassById)
  .patch(
    authorization(Roles.ADMIN, Roles.SUPER_ADMIN),
    joiMiddleWare(UpdateVehicleDetailValidation),
    vehicleDetailController.updateVehicleClass,
  )
  .delete(
    authorization(Roles.ADMIN, Roles.SUPER_ADMIN),
    vehicleDetailController.deleteVehicleClass,
  );

router
  .route('/type')
  .get(vehicleDetailController.getVehicleTypes)
  .post(
    authorization(Roles.ADMIN, Roles.SUPER_ADMIN),
    uploadToDiskStorage.single('file_path'),
    validateMulterType(['jpeg', 'jpg', 'png', 'pdf'], true),
    joiMiddleWare(CreateVehicleDetailValidation),
    vehicleDetailController.createVehicleType,
  );

router
  .route('/type/:id')
  .get(vehicleDetailController.getVehicleTypeById)
  .patch(
    authorization(Roles.ADMIN, Roles.SUPER_ADMIN),
    uploadToDiskStorage.single('file_path'),
    validateMulterType(['jpeg', 'jpg', 'png', 'pdf'], false),
    joiMiddleWare(UpdateVehicleDetailValidation),
    vehicleDetailController.updateVehicleType,
  )
  .delete(
    authorization(Roles.ADMIN, Roles.SUPER_ADMIN),
    vehicleDetailController.deleteVehicleType,
  );

router
  .route('/name')
  .get(vehicleDetailController.getVehicleNames)
  .post(
    authorization(Roles.ADMIN, Roles.SUPER_ADMIN),
    joiMiddleWare(CreateVehicleDetailValidation),
    vehicleDetailController.createVehicleName,
  );

router
  .route('/name/:id')
  .get(vehicleDetailController.getVehicleNameById)
  .patch(
    authorization(Roles.ADMIN, Roles.SUPER_ADMIN),
    joiMiddleWare(UpdateVehicleDetailValidation),
    vehicleDetailController.updateVehicleName,
  )
  .delete(
    authorization(Roles.ADMIN, Roles.SUPER_ADMIN),
    vehicleDetailController.deleteVehicleName,
  );

export default router;
