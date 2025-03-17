"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __importDefault(require("../../prisma/client"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
class FavoriteDriverService {
    async addToFavorite(userId, driverId) {
        const favoriteDriver = await client_1.default.favorite_Driver.findUnique({
            where: {
                userId_driverId: {
                    userId,
                    driverId,
                },
            },
        });
        if (favoriteDriver)
            throw new ApiError_1.default('Driver already in favorites', 400);
        await client_1.default.favorite_Driver.create({
            data: {
                userId,
                driverId,
            },
        });
    }
    async removeFromFavorite(userId, driverId) {
        await client_1.default.favorite_Driver.deleteMany({
            where: {
                userId,
                driverId,
            },
        });
    }
    // Use raw query to get drivers reviews count
    async getFavoriteDrivers(userId, query) {
        const page = query.page || 1;
        const limit = query.limit || 40;
        const offset = (page - 1) * limit;
        const data = await client_1.default.$queryRaw `
        SELECT d.id, d.name, d.avatar, d.driver_rate as rating, COUNT(r.id)::int AS reviews
        FROM "Favorite_Driver" fd
        JOIN "User" d ON fd."driverId" = d.id
        LEFT JOIN "Reviews" r ON d.id = r.target_id
        WHERE fd."userId" = ${userId}
        GROUP BY d.id, d.name, d.avatar, d.driver_rate
        LIMIT ${limit}
        OFFSET ${offset}
    `;
        const total = await client_1.default.favorite_Driver.count({
            where: {
                userId,
            },
        });
        const pagination = {
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            page: +page,
            limit: +limit,
        };
        return {
            data,
            pagination,
        };
    }
}
const favoriteDriverService = new FavoriteDriverService();
exports.default = favoriteDriverService;
