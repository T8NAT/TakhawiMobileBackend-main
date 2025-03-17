"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../middlewares/auth"));
const authorization_1 = __importDefault(require("../middlewares/authorization"));
const roles_1 = require("../enum/roles");
const pdfReportController_1 = __importDefault(require("../controllers/pdfReportController"));
const joiMiddleware_1 = __importDefault(require("../middlewares/joiMiddleware"));
const pdfReportValidations_1 = require("../validations/pdfReportValidations");
const router = (0, express_1.Router)();
router.use(auth_1.default);
router.get('/driver/:tripId', (0, authorization_1.default)(roles_1.Roles.DRIVER), (0, joiMiddleware_1.default)(pdfReportValidations_1.pdfReportValidations, 'query'), pdfReportController_1.default.generateDriverTripReportPdf);
router.get('/user/:tripId', (0, authorization_1.default)(roles_1.Roles.USER), (0, joiMiddleware_1.default)(pdfReportValidations_1.pdfReportValidations, 'query'), pdfReportController_1.default.generateUserTripReportPdf);
exports.default = router;
