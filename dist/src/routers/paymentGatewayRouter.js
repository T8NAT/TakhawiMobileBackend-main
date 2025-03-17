"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../middlewares/auth"));
const paymentGatewayControler_1 = __importDefault(require("../controllers/paymentGatewayControler"));
const joiMiddleware_1 = __importDefault(require("../middlewares/joiMiddleware"));
const paymentGatewayValidations_1 = require("../validations/paymentGatewayValidations");
const router = (0, express_1.Router)();
router.get('/apple-pay-session', (0, joiMiddleware_1.default)(paymentGatewayValidations_1.applepaySessionValidation, 'query'), paymentGatewayControler_1.default.getApplePaySession);
router.get('/initial-payment-status/:checkOutId/:userId', paymentGatewayControler_1.default.getInitialPaymentStatus);
// TODO: for test only remove it later
router.get('/prepare-checkout', auth_1.default, paymentGatewayControler_1.default.prepareCheckout);
exports.default = router;
