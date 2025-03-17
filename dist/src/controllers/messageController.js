"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const messagesService_1 = __importDefault(require("../services/messagesService"));
const response_1 = __importDefault(require("../utils/response"));
class MessageController {
    async sendMessage(req, res, next) {
        try {
            const { user } = req;
            await messagesService_1.default.sendMessage({
                ...req.body,
                content: req.file.path,
                senderId: user,
            });
            (0, response_1.default)(res, 201, {
                status: true,
                message: 'Message sent successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getAll(req, res, next) {
        try {
            const { data, pagination } = await messagesService_1.default.getAll(req.query, req.params.chatId);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Messages fetched successfully',
                pagination,
                result: data,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async markAllAsRead(req, res, next) {
        try {
            const { user } = req;
            const { chatId } = req.params;
            await messagesService_1.default.markAllAsRead(chatId, user);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Messages marked as read successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
}
const messageController = new MessageController();
exports.default = messageController;
