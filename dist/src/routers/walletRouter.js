"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const walletControoler_1 = __importDefault(require("../controllers/walletControoler"));
const auth_1 = __importDefault(require("../middlewares/auth"));
const joiMiddleware_1 = __importDefault(require("../middlewares/joiMiddleware"));
const walletValidations_1 = require("../validations/walletValidations");
const authorization_1 = __importDefault(require("../middlewares/authorization"));
const roles_1 = require("../enum/roles");
const router = (0, express_1.Router)();
router.use(auth_1.default);
router.get('/user-transactions', (0, authorization_1.default)(roles_1.Roles.USER), (0, joiMiddleware_1.default)(walletValidations_1.walletTransactionsQuerySchema, 'query'), walletControoler_1.default.getUserWalletHistory);
router.get('/driver-transactions', (0, authorization_1.default)(roles_1.Roles.DRIVER), (0, joiMiddleware_1.default)(walletValidations_1.walletTransactionsQuerySchema, 'query'), walletControoler_1.default.getDriverWalletHistory);
router.post('/recharge', (0, authorization_1.default)(roles_1.Roles.USER), (0, joiMiddleware_1.default)(walletValidations_1.rechargeWalletSchema), walletControoler_1.default.walletRecharge);
exports.default = router;
