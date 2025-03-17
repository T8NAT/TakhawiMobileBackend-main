"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = __importDefault(require("../controllers/authController"));
const multer_1 = __importDefault(require("../middlewares/multer"));
const joiMiddleware_1 = __importDefault(require("../middlewares/joiMiddleware"));
const authValidations_1 = require("../validations/authValidations");
const auth_1 = __importDefault(require("../middlewares/auth"));
const router = (0, express_1.Router)();
router.post('/check-phone-exist', (0, joiMiddleware_1.default)(authValidations_1.checkPhoneExistValidationSchema), authController_1.default.checkPhoneExist);
router.post('/check-email-exist', (0, joiMiddleware_1.default)(authValidations_1.checkEmailExistValidationSchema), authController_1.default.checkEmailExist);
router.post('/signup', multer_1.default.single('avatar'), (0, joiMiddleware_1.default)(authValidations_1.signUpValidationSchema), authController_1.default.signUpUser);
router.post('/login', (0, joiMiddleware_1.default)(authValidations_1.loginValidationSchema), authController_1.default.login);
router.post('/login/mobile', (0, joiMiddleware_1.default)(authValidations_1.loginValidationSchema), authController_1.default.loginFromMobile);
// router.post("/add-users", authController.addUsers);
router.post('/forget-password', (0, joiMiddleware_1.default)(authValidations_1.checkPhoneExistValidationSchema), authController_1.default.forgetPassword);
router.post('/verify-reset-code', (0, joiMiddleware_1.default)(authValidations_1.verifyResetCodeValidationSchema), authController_1.default.verifyResetCode);
router.post('/reset-password', (0, joiMiddleware_1.default)(authValidations_1.resetPasswordValidationSchema), authController_1.default.resetPassword);
router.patch('/change-password', auth_1.default, (0, joiMiddleware_1.default)(authValidations_1.changePasswordValidations), authController_1.default.changePassword);
router.post('/send-verification-code', auth_1.default, authController_1.default.sendVerificationCode);
router.post('/verify-phone-code', auth_1.default, (0, joiMiddleware_1.default)(authValidations_1.verifyPhoneCodeSchema), authController_1.default.verifyPhoneCode);
router.get('/callback', (req, res) => {
    res.send('callback');
});
exports.default = router;
