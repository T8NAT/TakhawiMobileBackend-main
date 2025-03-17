"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __importDefault(require("../../prisma/client"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const pagination_1 = require("../utils/pagination");
class MessageService {
    async sendMessage(data) {
        const chat = await client_1.default.chat.findUnique({
            where: { id: data.chatId },
            include: {
                ChatRoom: {
                    select: {
                        socketId: true,
                        userId: true,
                    },
                },
                User: {
                    select: {
                        User_FCM_Tokens: true,
                        prefered_language: true,
                    },
                },
                Driver: {
                    select: {
                        User_FCM_Tokens: true,
                        prefered_language: true,
                    },
                },
            },
        });
        if (!chat)
            throw new ApiError_1.default('Chat not found', 404);
        if (!chat.is_active)
            throw new ApiError_1.default('Chat is closed', 400);
        if (chat.driverId !== data.senderId && chat.userId !== data.senderId) {
            throw new ApiError_1.default('You are not allowed to send message in this chat', 400);
        }
        const message = await client_1.default.message.create({
            data,
        });
        const usersId = [];
        return {
            ...message,
            sockets: chat.ChatRoom.map((room) => {
                usersId.push(room.userId);
                return room.socketId;
            }),
            fcms: message.senderId === chat.userId
                ? chat.Driver.User_FCM_Tokens
                : chat.User.User_FCM_Tokens,
            usersId,
            reciverId: message.senderId === chat.userId ? chat.driverId : chat.userId,
            language: message.senderId === chat.userId
                ? chat.Driver.prefered_language
                : chat.User.prefered_language,
        };
    }
    async getAll(query, chatId) {
        return (0, pagination_1.paginate)('message', { where: { chatId }, orderBy: { createdAt: 'desc' } }, query.page, query.limit);
    }
    async markAllAsRead(chatId, userId) {
        await client_1.default.message.updateMany({
            where: { chatId, senderId: { not: userId } },
            data: { is_read: true },
        });
        return true;
    }
}
const messageService = new MessageService();
exports.default = messageService;
