"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminDashboardController_1 = __importDefault(require("../controllers/adminDashboardController"));
const auth_1 = __importDefault(require("../middlewares/auth"));
const authorization_1 = __importDefault(require("../middlewares/authorization"));
const roles_1 = require("../enum/roles");
const joiMiddleware_1 = require("../middlewares/joiMiddleware");
const adminDashboardValidations_1 = require("../validations/adminDashboardValidations");
const router = (0, express_1.Router)();
router.use(auth_1.default, (0, authorization_1.default)(roles_1.Roles.SUPER_ADMIN, roles_1.Roles.ADMIN));
router.get('/driver-statistics', adminDashboardController_1.default.getDriverStatistics);
router.get('/trip-statistics', adminDashboardController_1.default.getTripStatistics);
router.get('/passenger-transactions', (0, joiMiddleware_1.joiAsyncMiddleWare)(adminDashboardValidations_1.userTransactionsQueryValidation, 'query'), adminDashboardController_1.default.getPassengerTransactions);
router.get('/driver-transactions', (0, joiMiddleware_1.joiAsyncMiddleWare)(adminDashboardValidations_1.userTransactionsQueryValidation, 'query'), adminDashboardController_1.default.getDriverTransactions);
router.get('/earnings-report', adminDashboardController_1.default.generateEarningsReport);
exports.default = router;
