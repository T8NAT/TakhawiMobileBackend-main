"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = __importDefault(require("../../prisma/client"));
const roles_1 = require("../enum/roles");
const wallet_1 = require("../enum/wallet");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const signToken_1 = require("../utils/signToken");
class UserManagementService {
    async updateLocation(id, location) {
        await client_1.default.user.update({
            where: { id },
            data: { location },
        });
    }
    async updateUserStatus(id, role, status) {
        const user = await client_1.default.user.findUnique({
            where: {
                id,
                deletedAt: null,
            },
        });
        if (!user) {
            throw new ApiError_1.default('User not found', 404);
        }
        await client_1.default.user.update({
            where: { id },
            data: role === roles_1.Roles.DRIVER
                ? { driver_status: status }
                : { passenger_status: status },
        });
    }
    async createFCMToken(userId, token) {
        await client_1.default.user_FCM_Token.upsert({
            where: {
                token,
            },
            create: {
                token,
                userId,
            },
            update: {},
        });
    }
    async checkBalanceAndUpdateWallet(user, amount, trip_id) {
        if (user.user_wallet_balance < amount) {
            throw new ApiError_1.default('Insufficient balance', 400);
        }
        else {
            await client_1.default.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    user_wallet_balance: {
                        decrement: amount,
                    },
                    Passenger_Wallet_Transaction: {
                        create: {
                            amount,
                            current_balance: user.user_wallet_balance - amount,
                            previous_balance: user.user_wallet_balance,
                            transaction_type: wallet_1.TransactionType.BOOK_TRIP,
                            trip_id,
                        },
                    },
                },
            });
        }
    }
    async switchToDriver(token, user) {
        if (!token) {
            throw new ApiError_1.default('No Token Provided', 401);
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY_ACCESSTOKEN);
        const tokens = (0, signToken_1.generateTokens)({
            uuid: decoded.id,
            role: roles_1.Roles.DRIVER,
        });
        if (user.switch_to_driver === false) {
            await client_1.default.user.update({
                where: { id: user.id },
                data: { switch_to_driver: true },
            });
        }
        return tokens;
    }
    switchToUser(token) {
        if (!token) {
            throw new ApiError_1.default('No Token Provided', 401);
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY_ACCESSTOKEN);
        const tokens = (0, signToken_1.generateTokens)({
            uuid: decoded.id,
            role: roles_1.Roles.USER,
        });
        return tokens;
    }
}
const userManagementService = new UserManagementService();
exports.default = userManagementService;
