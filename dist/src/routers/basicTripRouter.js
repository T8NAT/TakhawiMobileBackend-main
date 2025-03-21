"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const basicTripController_1 = __importDefault(require("../controllers/basicTripController"));
const auth_1 = __importDefault(require("../middlewares/auth"));
const authorization_1 = __importDefault(require("../middlewares/authorization"));
const roles_1 = require("../enum/roles");
const joiMiddleware_1 = require("../middlewares/joiMiddleware");
const basicTripValidations_1 = require("../validations/basicTripValidations");
const checkAvailableReserve_1 = require("../middlewares/checkAvailableReserve");
const checkAvailableDriverMakeTrip_1 = require("../middlewares/checkAvailableDriverMakeTrip");
const processPaymentMiddleware_1 = require("../middlewares/processPaymentMiddleware");
const router = (0, express_1.Router)();
router.get('/apple-pay/join/:transactionId', basicTripController_1.default.applepayJoin);
router.use(auth_1.default);
router.post('/', (0, authorization_1.default)(roles_1.Roles.DRIVER), (0, joiMiddleware_1.joiAsyncMiddleWare)(basicTripValidations_1.createBasicTripValidation), checkAvailableDriverMakeTrip_1.checkAvailableDriverMakeTrip, basicTripController_1.default.create);
router.get('/:tripId', (0, authorization_1.default)(roles_1.Roles.USER), basicTripController_1.default.get);
router.get('/', (0, authorization_1.default)(roles_1.Roles.USER), (0, joiMiddleware_1.joiAsyncMiddleWare)(basicTripValidations_1.basicTripQueryTypeValidation, 'query'), basicTripController_1.default.getAll);
router.post('/join', (0, authorization_1.default)(roles_1.Roles.USER), (0, joiMiddleware_1.joiAsyncMiddleWare)(basicTripValidations_1.joinBasicTripValidation), checkAvailableReserve_1.checkAvailableReserve, processPaymentMiddleware_1.processPaymentMiddleware, basicTripController_1.default.join);
router.delete('/cancel-by-driver/:tripId', (0, authorization_1.default)(roles_1.Roles.DRIVER), (0, joiMiddleware_1.joiAsyncMiddleWare)(basicTripValidations_1.CancelBasicTripValidation), basicTripController_1.default.cancelBYDriver);
router.delete('/cancel-by-passenger/:passengerTripId', (0, authorization_1.default)(roles_1.Roles.USER), (0, joiMiddleware_1.joiAsyncMiddleWare)(basicTripValidations_1.CancelPassengerTripValidation), basicTripController_1.default.cancelByPassenger);
router.patch('/end-trip/:tripId', (0, authorization_1.default)(roles_1.Roles.DRIVER), basicTripController_1.default.endTrip);
router.post('/calculate-price/:tripId', (0, authorization_1.default)(roles_1.Roles.USER), (0, joiMiddleware_1.joiAsyncMiddleWare)(basicTripValidations_1.calculateTripPriceValidation, 'body'), basicTripController_1.default.calculateTripPrice);
router.patch('/mark-as-arrived/:passengerTripId', (0, authorization_1.default)(roles_1.Roles.DRIVER), basicTripController_1.default.markPassengerAsArrived);
exports.default = router;
