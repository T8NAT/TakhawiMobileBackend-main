"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reasonController_1 = __importDefault(require("../controllers/reasonController"));
const authorization_1 = __importDefault(require("../middlewares/authorization"));
const joiMiddleware_1 = __importDefault(require("../middlewares/joiMiddleware"));
const reasonValidations_1 = require("../validations/reasonValidations");
const roles_1 = require("../enum/roles");
const auth_1 = __importDefault(require("../middlewares/auth"));
const router = (0, express_1.Router)();
router.use(auth_1.default);
router.get('/', reasonController_1.default.getAll);
router.use((0, authorization_1.default)(roles_1.Roles.SUPER_ADMIN, roles_1.Roles.ADMIN));
router
    .route('/')
    .post((0, joiMiddleware_1.default)(reasonValidations_1.createReasonValidation), reasonController_1.default.create);
router
    .route('/:id')
    .get(reasonController_1.default.getOne)
    .patch((0, joiMiddleware_1.default)(reasonValidations_1.updateReasonValidation), reasonController_1.default.update)
    .delete(reasonController_1.default.delete);
exports.default = router;
