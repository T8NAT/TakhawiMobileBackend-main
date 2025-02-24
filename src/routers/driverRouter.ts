import { Router } from 'express';

import driverController from '../controllers/driverController';
import auth from '../middlewares/auth';
import authorization from '../middlewares/authorization';
import uploadToDiskStorage from '../middlewares/multer';
import {
  nearstDriversSchema,
  uploadNationalIDValidation,
} from '../validations/driverValidations';
import joiMiddleWare from '../middlewares/joiMiddleware';
import {
  NationalIDImages,
  DrivingLicenceImages,
} from '../enum/driverDocuments';
import { validateMulterManyFilesType } from '../middlewares/multerTypeValidation';
import { Roles } from '../enum/roles';

const router = Router();

router.use(auth);

router.get(
  '/nearest-drivers',
  authorization(Roles.DRIVER),
  joiMiddleWare(nearstDriversSchema, 'query'),
  driverController.getNearestDrivers,
);

router.post(
  '/upload-national-id',
  authorization(Roles.DRIVER, Roles.USER),
  uploadToDiskStorage.fields([
    { name: NationalIDImages.FRONT, maxCount: 1 },
    { name: NationalIDImages.BACK, maxCount: 1 },
  ]),
  validateMulterManyFilesType([
    {
      name: NationalIDImages.FRONT,
      maxCount: 1,
      minCount: 1,
      isFilesRequired: true,
      acceptedFiles: ['jpeg', 'jpg', 'png', 'pdf'],
    },
    {
      name: NationalIDImages.BACK,
      maxCount: 1,
      minCount: 1,
      isFilesRequired: true,
      acceptedFiles: ['jpeg', 'jpg', 'png', 'pdf'],
    },
  ]),
  joiMiddleWare(uploadNationalIDValidation),
  driverController.uploadNationalID,
);

router.post(
  '/upload-driving-licence',
  authorization(Roles.DRIVER),
  uploadToDiskStorage.fields([
    { name: DrivingLicenceImages.FRONT, maxCount: 1 },
    { name: DrivingLicenceImages.BACK, maxCount: 1 },
  ]),
  validateMulterManyFilesType([
    {
      name: DrivingLicenceImages.FRONT,
      maxCount: 1,
      minCount: 1,
      isFilesRequired: true,
      acceptedFiles: ['jpeg', 'jpg', 'png', 'pdf'],
    },
    {
      name: DrivingLicenceImages.BACK,
      maxCount: 1,
      minCount: 1,
      isFilesRequired: true,
      acceptedFiles: ['jpeg', 'jpg', 'png', 'pdf'],
    },
  ]),
  driverController.uploadDriverLicense,
);

router.get(
  '/check-status',
  authorization(Roles.DRIVER),
  driverController.checkUploadStatus,
);

export default router;
