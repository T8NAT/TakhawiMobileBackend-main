"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const vehicleController_1 = __importDefault(require("../controllers/vehicleController"));
const joiMiddleware_1 = __importDefault(require("../middlewares/joiMiddleware"));
const vehicleValidations_1 = require("../validations/vehicleValidations");
const auth_1 = __importDefault(require("../middlewares/auth"));
const authorization_1 = __importDefault(require("../middlewares/authorization"));
const roles_1 = require("../enum/roles");
const multer_1 = __importDefault(require("../middlewares/multer"));
const multerTypeValidation_1 = require("../middlewares/multerTypeValidation");
const vehicle_1 = require("../enum/vehicle");
const router = (0, express_1.Router)();
router.use(auth_1.default);
// Role here like SUPER_ADMIN will change based on business logic
router
    .route('/')
    .post((0, authorization_1.default)(roles_1.Roles.DRIVER), (0, joiMiddleware_1.default)(vehicleValidations_1.createVehicleValidation), vehicleController_1.default.create)
    .get((0, authorization_1.default)(roles_1.Roles.SUPER_ADMIN), (0, joiMiddleware_1.default)(vehicleValidations_1.VehicleQueryTypeValidation, 'query'), vehicleController_1.default.getAll);
router
    .use((0, authorization_1.default)(roles_1.Roles.SUPER_ADMIN, roles_1.Roles.DRIVER))
    .route('/:id')
    .get(vehicleController_1.default.getOne)
    .patch((0, joiMiddleware_1.default)(vehicleValidations_1.updateVehicleValidation), vehicleController_1.default.update)
    .delete(vehicleController_1.default.delete);
router.use((0, authorization_1.default)(roles_1.Roles.DRIVER));
router
    .post('/upload-images', multer_1.default.array('file_path', 4), (0, multerTypeValidation_1.validateMulterArray)(['jpeg', 'png', 'jpg', 'pdf'], 4, 4, true), vehicleController_1.default.uploadVehicleImages);
router
    .post('/licence-images', multer_1.default.array('file_path', 2), (0, multerTypeValidation_1.validateMulterArray)(['jpeg', 'png', 'jpg', 'pdf'], 2, 2, true), vehicleController_1.default.uploadVehicleLicence);
router
    .post('/insurance-image', multer_1.default.single('file_path'), (0, multerTypeValidation_1.validateMulterType)(['jpeg', 'png', 'jpg', 'pdf']), vehicleController_1.default.uploadVehicleInsurance);
router
    .post('/add-new-vehicle', multer_1.default.fields([
    { name: vehicle_1.VehicleImageType.INSURANCE, maxCount: 1 },
    { name: vehicle_1.VehicleImageType.LICENCE, maxCount: 2 },
    { name: vehicle_1.VehicleImageType.VEHICLE, maxCount: 4 },
]), (0, multerTypeValidation_1.validateMulterManyFilesType)([
    {
        name: vehicle_1.VehicleImageType.INSURANCE,
        maxCount: 1,
        minCount: 1,
        isFilesRequired: true,
        acceptedFiles: ['jpeg', 'jpg', 'png', 'pdf'],
    },
    {
        name: vehicle_1.VehicleImageType.LICENCE,
        maxCount: 2,
        minCount: 2,
        isFilesRequired: true,
        acceptedFiles: ['jpeg', 'jpg', 'png', 'pdf'],
    },
    {
        name: vehicle_1.VehicleImageType.VEHICLE,
        maxCount: 4,
        minCount: 4,
        isFilesRequired: true,
        acceptedFiles: ['jpeg', 'jpg', 'png', 'pdf'],
    },
]), (0, joiMiddleware_1.default)(vehicleValidations_1.createVehicleValidation), vehicleController_1.default.addNewVehicle);
exports.default = router;
