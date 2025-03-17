"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chatService_1 = __importDefault(require("../services/chatService"));
const response_1 = __importDefault(require("../utils/response"));
const chat_serialization_1 = require("../utils/serialization/chat.serialization");
class ChatController {
    async openChat(req, res, next) {
        try {
            const { user, role } = req;
            const chat = await chatService_1.default.openChat({
                ...req.body,
                [`${role.toLowerCase()}Id`]: user, // this will update the driverId or userId with the current user id for better data integrity
            });
            (0, response_1.default)(res, 201, {
                status: true,
                message: 'Chat opened successfully',
                result: chat,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getAll(req, res, next) {
        try {
            const { user, role } = req;
            const { data, pagination } = await chatService_1.default.getAll(req.query, role, user);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Chats fetched successfully',
                pagination,
                result: (0, chat_serialization_1.serializeChats)(data),
            });
        }
        catch (error) {
            next(error);
        }
    }
}
const chatController = new ChatController();
exports.default = chatController;
