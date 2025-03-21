"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../middlewares/auth"));
const waslController_1 = __importDefault(require("../controllers/waslController"));
const waslValidations_1 = require("../validations/waslValidations");
const joiMiddleware_1 = __importDefault(require("../middlewares/joiMiddleware"));
const authorization_1 = __importDefault(require("../middlewares/authorization"));
const roles_1 = require("../enum/roles");
const router = (0, express_1.Router)();
router.use(auth_1.default, (0, authorization_1.default)(roles_1.Roles.DRIVER, roles_1.Roles.ADMIN, roles_1.Roles.SUPER_ADMIN));
router.post('/', (0, joiMiddleware_1.default)(waslValidations_1.createDriverandVehicleRegistrationSchema), waslController_1.default.createDriverandVehicleRegistration);
router.get('/', (0, joiMiddleware_1.default)(waslValidations_1.createDriverandVehicleRegistrationSchema, 'query'), waslController_1.default.getDriverandVehicleRegistration);
router.use((0, authorization_1.default)(roles_1.Roles.ADMIN, roles_1.Roles.SUPER_ADMIN));
router.post('/trip', (0, joiMiddleware_1.default)(waslValidations_1.createTripRegistrationSchema), waslController_1.default.createTripRegistration);
router.get('/trips-log', (0, authorization_1.default)(roles_1.Roles.ADMIN, roles_1.Roles.SUPER_ADMIN), waslController_1.default.getTripsLog);
exports.default = router;
