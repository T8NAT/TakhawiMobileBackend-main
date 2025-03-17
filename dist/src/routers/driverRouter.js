"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const driverController_1 = __importDefault(require("../controllers/driverController"));
const auth_1 = __importDefault(require("../middlewares/auth"));
const authorization_1 = __importDefault(require("../middlewares/authorization"));
const multer_1 = __importDefault(require("../middlewares/multer"));
const driverValidations_1 = require("../validations/driverValidations");
const joiMiddleware_1 = __importDefault(require("../middlewares/joiMiddleware"));
const driverDocuments_1 = require("../enum/driverDocuments");
const multerTypeValidation_1 = require("../middlewares/multerTypeValidation");
const roles_1 = require("../enum/roles");
const router = (0, express_1.Router)();
router.use(auth_1.default);
router.get('/nearest-drivers', (0, authorization_1.default)(roles_1.Roles.DRIVER), (0, joiMiddleware_1.default)(driverValidations_1.nearstDriversSchema, 'query'), driverController_1.default.getNearestDrivers);
router.post('/upload-national-id', (0, authorization_1.default)(roles_1.Roles.DRIVER, roles_1.Roles.USER), multer_1.default.fields([
    { name: driverDocuments_1.NationalIDImages.FRONT, maxCount: 1 },
    { name: driverDocuments_1.NationalIDImages.BACK, maxCount: 1 },
]), (0, multerTypeValidation_1.validateMulterManyFilesType)([
    {
        name: driverDocuments_1.NationalIDImages.FRONT,
        maxCount: 1,
        minCount: 1,
        isFilesRequired: true,
        acceptedFiles: ['jpeg', 'jpg', 'png', 'pdf'],
    },
    {
        name: driverDocuments_1.NationalIDImages.BACK,
        maxCount: 1,
        minCount: 1,
        isFilesRequired: true,
        acceptedFiles: ['jpeg', 'jpg', 'png', 'pdf'],
    },
]), (0, joiMiddleware_1.default)(driverValidations_1.uploadNationalIDValidation), driverController_1.default.uploadNationalID);
router.post('/upload-driving-licence', (0, authorization_1.default)(roles_1.Roles.DRIVER), multer_1.default.fields([
    { name: driverDocuments_1.DrivingLicenceImages.FRONT, maxCount: 1 },
    { name: driverDocuments_1.DrivingLicenceImages.BACK, maxCount: 1 },
]), (0, multerTypeValidation_1.validateMulterManyFilesType)([
    {
        name: driverDocuments_1.DrivingLicenceImages.FRONT,
        maxCount: 1,
        minCount: 1,
        isFilesRequired: true,
        acceptedFiles: ['jpeg', 'jpg', 'png', 'pdf'],
    },
    {
        name: driverDocuments_1.DrivingLicenceImages.BACK,
        maxCount: 1,
        minCount: 1,
        isFilesRequired: true,
        acceptedFiles: ['jpeg', 'jpg', 'png', 'pdf'],
    },
]), driverController_1.default.uploadDriverLicense);
router.get('/check-status', (0, authorization_1.default)(roles_1.Roles.DRIVER), driverController_1.default.checkUploadStatus);
exports.default = router;
