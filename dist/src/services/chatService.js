"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __importDefault(require("../../prisma/client"));
const roles_1 = require("../enum/roles");
const trip_1 = require("../enum/trip");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const pagination_1 = require("../utils/pagination");
class ChatService {
    async openChat(data) {
        const chat = await client_1.default.chat.findUnique({
            where: {
                userId_driverId_tripId: {
                    userId: data.userId,
                    driverId: data.driverId,
                    tripId: data.tripId,
                },
            },
        });
        if (chat)
            return chat;
        await this.validateOpenChatMethod(data);
        return client_1.default.chat.create({
            data,
        });
    }
    async getAll(query, role, userId) {
        return (0, pagination_1.paginate)('chat', {
            where: {
                [`${role.toLowerCase()}Id`]: userId, // Get chats based on the role
            },
            include: {
                [role === roles_1.Roles.DRIVER ? 'User' : 'Driver']: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                        phone: true,
                    },
                },
                Messages: {
                    take: 1,
                    orderBy: { createdAt: 'desc' }
                },
                _count: {
                    select: {
                        Messages: {
                            where: {
                                is_read: false,
                                senderId: { not: userId },
                            },
                        },
                    },
                },
            },
        }, query.page, query.limit);
    }
    async validateOpenChatMethod(data) {
        const trip = await client_1.default.trip.findUnique({
            where: { id: data.tripId },
        });
        if (!trip)
            throw new ApiError_1.default('Trip not found', 404);
        if (trip.status === trip_1.TripStatus.COMPLETED)
            throw new ApiError_1.default('Trip is completed', 400);
        if (trip.status === trip_1.TripStatus.CANCELLED)
            throw new ApiError_1.default('Trip is cancelled', 400);
        if (trip.driver_id !== data.driverId)
            throw new ApiError_1.default('Driver not assigned to trip', 400);
        const users = await client_1.default.user.count({
            where: {
                id: { in: [data.driverId, data.userId] },
            },
        });
        if (users !== 2)
            throw new ApiError_1.default('Driver or user not found', 404);
    }
}
const chatService = new ChatService();
exports.default = chatService;
