"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const vehicleDetailsController_1 = __importDefault(require("../controllers/vehicleDetailsController"));
const joiMiddleware_1 = __importDefault(require("../middlewares/joiMiddleware"));
const vehicleDetailsValidations_1 = require("../validations/vehicleDetailsValidations");
const auth_1 = __importDefault(require("../middlewares/auth"));
const authorization_1 = __importDefault(require("../middlewares/authorization"));
const roles_1 = require("../enum/roles");
const multerTypeValidation_1 = require("../middlewares/multerTypeValidation");
const multer_1 = __importDefault(require("../middlewares/multer"));
const router = (0, express_1.Router)();
router.use(auth_1.default);
router.route('/').get(vehicleDetailsController_1.default.getAllVehicleDetails);
router
    .route('/production-start-year')
    .get(vehicleDetailsController_1.default.getVehicleProductionStartYear)
    .post((0, authorization_1.default)(roles_1.Roles.ADMIN, roles_1.Roles.SUPER_ADMIN), (0, joiMiddleware_1.default)(vehicleDetailsValidations_1.vehicleProductionStartYearValidation), vehicleDetailsController_1.default.createVehicleProductionStartYear)
    .patch((0, authorization_1.default)(roles_1.Roles.ADMIN, roles_1.Roles.SUPER_ADMIN), (0, joiMiddleware_1.default)(vehicleDetailsValidations_1.vehicleProductionStartYearValidation), vehicleDetailsController_1.default.updateVehicleProductionStartYear);
router
    .route('/color')
    .get(vehicleDetailsController_1.default.getVehicleColors)
    .post((0, authorization_1.default)(roles_1.Roles.ADMIN, roles_1.Roles.SUPER_ADMIN), (0, joiMiddleware_1.default)(vehicleDetailsValidations_1.CreateVehicleDetailValidation), vehicleDetailsController_1.default.createVehicleColor);
router
    .route('/color/:id')
    .get(vehicleDetailsController_1.default.getVehicleColorById)
    .patch((0, authorization_1.default)(roles_1.Roles.ADMIN, roles_1.Roles.SUPER_ADMIN), (0, joiMiddleware_1.default)(vehicleDetailsValidations_1.UpdateVehicleDetailValidation), vehicleDetailsController_1.default.updateVehicleColor)
    .delete((0, authorization_1.default)(roles_1.Roles.ADMIN, roles_1.Roles.SUPER_ADMIN), vehicleDetailsController_1.default.deleteVehicleColor);
router
    .route('/class')
    .get(vehicleDetailsController_1.default.getVehicleClasses)
    .post((0, authorization_1.default)(roles_1.Roles.ADMIN, roles_1.Roles.SUPER_ADMIN), (0, joiMiddleware_1.default)(vehicleDetailsValidations_1.CreateVehicleDetailValidation), vehicleDetailsController_1.default.createVehicleClass);
router
    .route('/class/:id')
    .get(vehicleDetailsController_1.default.getVehicleClassById)
    .patch((0, authorization_1.default)(roles_1.Roles.ADMIN, roles_1.Roles.SUPER_ADMIN), (0, joiMiddleware_1.default)(vehicleDetailsValidations_1.UpdateVehicleDetailValidation), vehicleDetailsController_1.default.updateVehicleClass)
    .delete((0, authorization_1.default)(roles_1.Roles.ADMIN, roles_1.Roles.SUPER_ADMIN), vehicleDetailsController_1.default.deleteVehicleClass);
router
    .route('/type')
    .get(vehicleDetailsController_1.default.getVehicleTypes)
    .post((0, authorization_1.default)(roles_1.Roles.ADMIN, roles_1.Roles.SUPER_ADMIN), multer_1.default.single('file_path'), (0, multerTypeValidation_1.validateMulterType)(['jpeg', 'jpg', 'png', 'pdf'], true), (0, joiMiddleware_1.default)(vehicleDetailsValidations_1.CreateVehicleDetailValidation), vehicleDetailsController_1.default.createVehicleType);
router
    .route('/type/:id')
    .get(vehicleDetailsController_1.default.getVehicleTypeById)
    .patch((0, authorization_1.default)(roles_1.Roles.ADMIN, roles_1.Roles.SUPER_ADMIN), multer_1.default.single('file_path'), (0, multerTypeValidation_1.validateMulterType)(['jpeg', 'jpg', 'png', 'pdf'], false), (0, joiMiddleware_1.default)(vehicleDetailsValidations_1.UpdateVehicleDetailValidation), vehicleDetailsController_1.default.updateVehicleType)
    .delete((0, authorization_1.default)(roles_1.Roles.ADMIN, roles_1.Roles.SUPER_ADMIN), vehicleDetailsController_1.default.deleteVehicleType);
router
    .route('/name')
    .get(vehicleDetailsController_1.default.getVehicleNames)
    .post((0, authorization_1.default)(roles_1.Roles.ADMIN, roles_1.Roles.SUPER_ADMIN), (0, joiMiddleware_1.default)(vehicleDetailsValidations_1.CreateVehicleDetailValidation), vehicleDetailsController_1.default.createVehicleName);
router
    .route('/name/:id')
    .get(vehicleDetailsController_1.default.getVehicleNameById)
    .patch((0, authorization_1.default)(roles_1.Roles.ADMIN, roles_1.Roles.SUPER_ADMIN), (0, joiMiddleware_1.default)(vehicleDetailsValidations_1.UpdateVehicleDetailValidation), vehicleDetailsController_1.default.updateVehicleName)
    .delete((0, authorization_1.default)(roles_1.Roles.ADMIN, roles_1.Roles.SUPER_ADMIN), vehicleDetailsController_1.default.deleteVehicleName);
exports.default = router;
