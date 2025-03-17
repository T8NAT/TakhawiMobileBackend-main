"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __importDefault(require("../../prisma/client"));
const pagination_1 = require("../utils/pagination");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const settlementRequest_1 = require("../enum/settlementRequest");
const wallet_1 = require("../enum/wallet");
class SettlementRequestService {
    // TODO: Make trip_id optional
    async create(data) {
        const user = await client_1.default.user.findUnique({
            where: {
                id: data.user_id,
            },
            select: {
                driver_wallet_balance: true,
            },
        });
        if (user?.driver_wallet_balance < data.amount)
            throw new ApiError_1.default('Insufficient balance', 400);
        const [request] = await client_1.default.$transaction([
            client_1.default.settlement_Request.create({ data }),
            client_1.default.user.update({
                where: { id: data.user_id },
                data: {
                    driver_wallet_balance: { decrement: data.amount },
                    Driver_Wallet_Transaction: {
                        create: {
                            amount: -data.amount,
                            previous_balance: user.driver_wallet_balance,
                            current_balance: user.driver_wallet_balance - data.amount,
                            transaction_type: wallet_1.TransactionType.SETTLEMENT_REQUEST,
                        },
                    },
                },
            }),
        ]);
        return request;
    }
    async getAll(query) {
        return (0, pagination_1.paginate)('settlement_Request', {
            where: {
                status: query.status,
            },
        }, query.page, query.limit);
    }
    async getOne(id, userId) {
        const request = await client_1.default.settlement_Request.findUnique({
            where: { id, user_id: userId },
            include: {
                User: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        phone: true,
                        avatar: true,
                    },
                },
            },
        });
        if (!request)
            throw new ApiError_1.default('Settlement request not found', 404);
        return request;
    }
    async cancel(id, userId) {
        const request = await this.checkRequest(id, userId);
        await client_1.default.$transaction([
            client_1.default.settlement_Request.update({
                where: { id },
                data: { status: settlementRequest_1.SettlementRequestStatus.CANCELED },
            }),
            client_1.default.user.update({
                where: { id: request.user_id },
                data: {
                    driver_wallet_balance: { increment: request.amount },
                    Driver_Wallet_Transaction: {
                        create: {
                            amount: request.amount,
                            previous_balance: request.User.driver_wallet_balance,
                            current_balance: request.User.driver_wallet_balance + request.amount,
                            transaction_type: wallet_1.TransactionType.SETTLEMENT_REQUEST_CANCEL,
                        },
                    },
                },
            }),
        ]);
    }
    async approve(id, userId) {
        await this.checkRequest(id, userId);
        await client_1.default.settlement_Request.update({
            where: { id },
            data: { status: settlementRequest_1.SettlementRequestStatus.COMPLETED },
        });
    }
    async deny(id, userId) {
        const request = await this.checkRequest(id, userId);
        await client_1.default.$transaction([
            client_1.default.settlement_Request.update({
                where: { id },
                data: { status: settlementRequest_1.SettlementRequestStatus.DENIED },
            }),
            client_1.default.user.update({
                where: { id: request.user_id },
                data: {
                    driver_wallet_balance: { increment: request.amount },
                    Driver_Wallet_Transaction: {
                        create: {
                            amount: request.amount,
                            previous_balance: request.User.driver_wallet_balance,
                            current_balance: request.User.driver_wallet_balance + request.amount,
                            transaction_type: wallet_1.TransactionType.SETTLEMENT_REQUEST_DENY,
                        },
                    },
                },
            }),
        ]);
    }
    async checkRequest(id, userId) {
        const request = await client_1.default.settlement_Request.findUnique({
            where: {
                id,
                user_id: userId,
                status: settlementRequest_1.SettlementRequestStatus.PENDING,
            },
            include: {
                User: {
                    select: {
                        driver_wallet_balance: true,
                    },
                },
            },
        });
        if (!request)
            throw new ApiError_1.default('Settlement request not valid for this action', 404);
        return request;
    }
}
const settlementRequestService = new SettlementRequestService();
exports.default = settlementRequestService;
