"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const settlementRequestService_1 = __importDefault(require("../services/settlementRequestService"));
const response_1 = __importDefault(require("../utils/response"));
const roles_1 = require("../enum/roles");
class SettlementRequestService {
    async create(req, res, next) {
        try {
            const { user } = req;
            const request = await settlementRequestService_1.default.create({
                ...req.body,
                user_id: user,
            });
            (0, response_1.default)(res, 201, {
                status: true,
                message: 'Settlement request created',
                result: request,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getAll(req, res, next) {
        try {
            const requests = await settlementRequestService_1.default.getAll(req.query);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Settlement requests fetched',
                result: requests,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getOne(req, res, next) {
        try {
            const { user, role } = req;
            const request = await settlementRequestService_1.default.getOne(+req.params.id, role === roles_1.Roles.DRIVER ? user : undefined);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Settlement request fetched',
                result: request,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async cancel(req, res, next) {
        try {
            const { user } = req;
            await settlementRequestService_1.default.cancel(+req.params.id, user);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Settlement request canceled',
            });
        }
        catch (error) {
            next(error);
        }
    }
    async approve(req, res, next) {
        try {
            await settlementRequestService_1.default.approve(+req.params.id);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Settlement request approved',
            });
        }
        catch (error) {
            next(error);
        }
    }
    async deny(req, res, next) {
        try {
            await settlementRequestService_1.default.deny(+req.params.id);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Settlement request denied',
            });
        }
        catch (error) {
            next(error);
        }
    }
}
const settlementRequestController = new SettlementRequestService();
exports.default = settlementRequestController;
