"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../middlewares/auth"));
const authorization_1 = __importDefault(require("../middlewares/authorization"));
const roles_1 = require("../enum/roles");
const driverReportController_1 = __importDefault(require("../controllers/driverReportController"));
const tripValidations_1 = require("../validations/tripValidations");
const joiMiddleware_1 = __importDefault(require("../middlewares/joiMiddleware"));
const router = (0, express_1.Router)();
router.use(auth_1.default, (0, authorization_1.default)(roles_1.Roles.DRIVER));
router.get('/', driverReportController_1.default.getDriverProfitReport);
router.get('/monthly-profit', (0, joiMiddleware_1.default)(tripValidations_1.noOfMonthValidation, 'query'), driverReportController_1.default.getDriverReportPerMonth);
router.get('/financial-summary', driverReportController_1.default.getDriverFinancialSummary);
router.get('/:tripId/reviews', driverReportController_1.default.tripReviewReport);
router.get('/:tripId', driverReportController_1.default.getOneTripReport);
exports.default = router;
