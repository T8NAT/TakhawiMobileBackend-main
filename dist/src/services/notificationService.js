"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __importDefault(require("../../prisma/client"));
const pagination_1 = require("../utils/pagination");
const pushNotification_1 = __importDefault(require("../utils/pushNotification"));
class NotificationService {
    async create(data) {
        return client_1.default.notification.create({ data });
    }
    async getAll(queryString, userId) {
        return (0, pagination_1.paginate)('notification', {
            where: {
                userId,
            },
            orderBy: {
                createdAt: 'desc',
            },
        }, queryString.page, queryString.limit);
    }
    async markAsRead(id, userId) {
        await client_1.default.notification.update({
            where: {
                id,
                userId,
            },
            data: {
                is_read: true,
            },
        });
    }
    async markAllAsRead(userId) {
        await client_1.default.notification.updateMany({
            where: {
                userId,
            },
            data: {
                is_read: true,
            },
        });
    }
    async delete(id, userId) {
        await client_1.default.notification.delete({
            where: {
                id,
                userId,
            },
        });
    }
    async sendNotification(data) {
        const usertokens = data.userIds
            ? await client_1.default.user_FCM_Token.findMany({
                where: { userId: { in: data.userIds } },
            })
            : await client_1.default.user_FCM_Token.findMany();
        if (usertokens.length > 0) {
            data.tokens = usertokens.map((token) => token.token);
            await (0, pushNotification_1.default)(data);
        }
    }
}
const notificationService = new NotificationService();
exports.default = notificationService;
