"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chatController_1 = __importDefault(require("../controllers/chatController"));
const auth_1 = __importDefault(require("../middlewares/auth"));
const roles_1 = require("../enum/roles");
const authorization_1 = __importDefault(require("../middlewares/authorization"));
const joiMiddleware_1 = __importDefault(require("../middlewares/joiMiddleware"));
const chatValidations_1 = require("../validations/chatValidations");
const router = (0, express_1.Router)();
router.use(auth_1.default, (0, authorization_1.default)(roles_1.Roles.USER, roles_1.Roles.DRIVER));
router.post('/open-chat', (0, joiMiddleware_1.default)(chatValidations_1.openChatSchema), chatController_1.default.openChat);
router.get('/', chatController_1.default.getAll);
exports.default = router;
