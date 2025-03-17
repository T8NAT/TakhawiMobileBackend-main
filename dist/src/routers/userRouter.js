"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = __importDefault(require("../controllers/userController"));
const auth_1 = __importDefault(require("../middlewares/auth"));
const multer_1 = __importDefault(require("../middlewares/multer"));
const userValidations_1 = require("../validations/userValidations");
const joiMiddleware_1 = __importDefault(require("../middlewares/joiMiddleware"));
const userManagementController_1 = __importDefault(require("../controllers/userManagementController"));
const router = (0, express_1.Router)();
// TODO: Add authorization middleware to routes
router
    .route('/')
    .post(multer_1.default.single('avatar'), (0, joiMiddleware_1.default)(userValidations_1.createUserValidation), userController_1.default.create)
    .get((0, joiMiddleware_1.default)(userValidations_1.userQueryTypeSchema, 'query'), userController_1.default.getAll);
router.get('/drivers', userController_1.default.getDrivers);
router.use(auth_1.default);
router.get('/switch-to-driver', userManagementController_1.default.switchToDriver);
router.get('/switch-to-user', userManagementController_1.default.switchToUser);
router.patch('/update-location', (0, joiMiddleware_1.default)(userValidations_1.updateLocationSchema), userManagementController_1.default.updateLocation);
router
    .route('/profile')
    .get(userController_1.default.getProfile)
    .patch(multer_1.default.single('avatar'), (0, joiMiddleware_1.default)(userValidations_1.updateUserValidation), userController_1.default.updateProfile)
    .delete(userController_1.default.deleteProfile);
router.post('/fcm-token', (0, joiMiddleware_1.default)(userValidations_1.fcmtokenSchema), userManagementController_1.default.createFCMToken);
router.patch('/driver/status/:id', (0, joiMiddleware_1.default)(userValidations_1.updateUserStatusSchema), userManagementController_1.default.updateDriverStatus);
router.patch('/passenger/status/:id', (0, joiMiddleware_1.default)(userValidations_1.updateUserStatusSchema), userManagementController_1.default.updatePassengerStatus);
router.get('/:id', userController_1.default.getOne);
exports.default = router;
