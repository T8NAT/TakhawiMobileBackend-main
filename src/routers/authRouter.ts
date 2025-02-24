import { Router } from 'express';
import authController from '../controllers/authController';
import uploadToDiskStorage from '../middlewares/multer';
import joiMiddleWare from '../middlewares/joiMiddleware';
import {
  signUpValidationSchema,
  loginValidationSchema,
  checkPhoneExistValidationSchema,
  verifyResetCodeValidationSchema,
  resetPasswordValidationSchema,
  checkEmailExistValidationSchema,
  changePasswordValidations,
  verifyPhoneCodeSchema,
} from '../validations/authValidations';
import auth from '../middlewares/auth';

const router = Router();

router.post(
  '/check-phone-exist',
  joiMiddleWare(checkPhoneExistValidationSchema),
  authController.checkPhoneExist,
);

router.post(
  '/check-email-exist',
  joiMiddleWare(checkEmailExistValidationSchema),
  authController.checkEmailExist,
);

router.post(
  '/signup',
  uploadToDiskStorage.single('avatar'),
  joiMiddleWare(signUpValidationSchema),
  authController.signUpUser,
);

router.post(
  '/login',
  joiMiddleWare(loginValidationSchema),
  authController.login,
);

router.post(
  '/login/mobile',
  joiMiddleWare(loginValidationSchema),
  authController.loginFromMobile,
);

// router.post("/add-users", authController.addUsers);

router.post(
  '/forget-password',
  joiMiddleWare(checkPhoneExistValidationSchema),
  authController.forgetPassword,
);

router.post(
  '/verify-reset-code',
  joiMiddleWare(verifyResetCodeValidationSchema),
  authController.verifyResetCode,
);

router.post(
  '/reset-password',
  joiMiddleWare(resetPasswordValidationSchema),
  authController.resetPassword,
);

router.patch(
  '/change-password',
  auth,
  joiMiddleWare(changePasswordValidations),
  authController.changePassword,
);

router.post(
  '/send-verification-code',
  auth,
  authController.sendVerificationCode,
);

router.post(
  '/verify-phone-code',
  auth,
  joiMiddleWare(verifyPhoneCodeSchema),
  authController.verifyPhoneCode,
);

router.get('/callback', (req: any, res: any) => {
  res.send('callback');
});

export default router;
