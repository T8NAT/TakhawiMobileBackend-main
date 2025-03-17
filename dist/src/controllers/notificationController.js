"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const notificationService_1 = __importDefault(require("../services/notificationService"));
const response_1 = __importDefault(require("../utils/response"));
const notification_serialization_1 = require("../utils/serialization/notification.serialization");
class NotificationController {
    async create(req, res, next) {
        try {
            const notification = await notificationService_1.default.create(req.body);
            (0, response_1.default)(res, 201, {
                status: true,
                message: 'Notification created successfully',
                result: notification,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getAll(req, res, next) {
        try {
            const { user, language } = req;
            const data = await notificationService_1.default.getAll(req.query, user);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Notifications retrieved successfully',
                pagination: data.pagination,
                result: (0, notification_serialization_1.serializeNotifications)(data.data, language),
            });
        }
        catch (error) {
            next(error);
        }
    }
    async markAsRead(req, res, next) {
        try {
            const { id } = req.params;
            const { user } = req;
            await notificationService_1.default.markAsRead(+id, user);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Notification marked as read successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
    async markAllAsRead(req, res, next) {
        try {
            const { user } = req;
            await notificationService_1.default.markAllAsRead(user);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'All notifications marked as read successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const { user } = req;
            await notificationService_1.default.delete(Number(id), user);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Notification deleted successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
    async sendNotification(req, res, next) {
        try {
            await notificationService_1.default.sendNotification(req.body);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Notification sent successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
}
const notificationController = new NotificationController();
exports.default = notificationController;
