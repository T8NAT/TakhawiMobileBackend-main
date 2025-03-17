"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notificationController_1 = __importDefault(require("../controllers/notificationController"));
const auth_1 = __importDefault(require("../middlewares/auth"));
const joiMiddleware_1 = __importDefault(require("../middlewares/joiMiddleware"));
const notificationValidations_1 = require("../validations/notificationValidations");
const authorization_1 = __importDefault(require("../middlewares/authorization"));
const roles_1 = require("../enum/roles");
const router = (0, express_1.Router)();
router.use(auth_1.default);
router
    .route('/')
    .post((0, joiMiddleware_1.default)(notificationValidations_1.createNotificationSchema), notificationController_1.default.create)
    .get(notificationController_1.default.getAll)
    .patch(notificationController_1.default.markAllAsRead);
router
    .route('/:id')
    .patch(notificationController_1.default.markAsRead)
    .delete(notificationController_1.default.delete);
router.post('/send', (0, authorization_1.default)(roles_1.Roles.ADMIN, roles_1.Roles.SUPER_ADMIN), (0, joiMiddleware_1.default)(notificationValidations_1.sendNotificationSchema, 'body'), notificationController_1.default.sendNotification);
exports.default = router;
