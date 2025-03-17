"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../middlewares/auth"));
const authorization_1 = __importDefault(require("../middlewares/authorization"));
const appConfigController_1 = __importDefault(require("../controllers/appConfigController"));
const roles_1 = require("../enum/roles");
const joiMiddleware_1 = __importDefault(require("../middlewares/joiMiddleware"));
const appConfigValidations_1 = require("../validations/appConfigValidations");
const multer_1 = __importDefault(require("../middlewares/multer"));
const router = (0, express_1.Router)();
router.use(auth_1.default, (0, authorization_1.default)(roles_1.Roles.SUPER_ADMIN, roles_1.Roles.ADMIN));
router.route('/')
    .get((0, joiMiddleware_1.default)(appConfigValidations_1.appConfigQueryValidation, 'query'), appConfigController_1.default.getAll)
    .post(multer_1.default.single('value'), (0, joiMiddleware_1.default)(appConfigValidations_1.createAppConfigValidation, 'body'), appConfigController_1.default.create);
router.delete('/:id', appConfigController_1.default.delete);
exports.default = router;
