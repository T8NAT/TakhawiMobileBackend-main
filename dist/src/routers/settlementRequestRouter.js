"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const settlementRequestController_1 = __importDefault(require("../controllers/settlementRequestController"));
const auth_1 = __importDefault(require("../middlewares/auth"));
const authorization_1 = __importDefault(require("../middlewares/authorization"));
const joiMiddleware_1 = __importDefault(require("../middlewares/joiMiddleware"));
const settlementRequestValidations_1 = require("../validations/settlementRequestValidations");
const roles_1 = require("../enum/roles");
const router = (0, express_1.Router)();
router.use(auth_1.default);
router
    .route('/')
    .post((0, authorization_1.default)(roles_1.Roles.DRIVER), (0, joiMiddleware_1.default)(settlementRequestValidations_1.createSettlementRequestSchema), settlementRequestController_1.default.create)
    .get((0, authorization_1.default)(roles_1.Roles.SUPER_ADMIN, roles_1.Roles.ADMIN), (0, joiMiddleware_1.default)(settlementRequestValidations_1.settlementRequestQuerySchema, 'query'), settlementRequestController_1.default.getAll);
router
    .route('/:id')
    .get((0, authorization_1.default)(roles_1.Roles.SUPER_ADMIN, roles_1.Roles.ADMIN, roles_1.Roles.DRIVER), settlementRequestController_1.default.getOne)
    .delete((0, authorization_1.default)(roles_1.Roles.DRIVER), settlementRequestController_1.default.cancel);
router.patch('/approve/:id', (0, authorization_1.default)(roles_1.Roles.SUPER_ADMIN, roles_1.Roles.ADMIN), settlementRequestController_1.default.approve);
router.patch('/deny/:id', (0, authorization_1.default)(roles_1.Roles.SUPER_ADMIN, roles_1.Roles.ADMIN), settlementRequestController_1.default.deny);
exports.default = router;
