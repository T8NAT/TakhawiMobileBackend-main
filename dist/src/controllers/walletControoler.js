"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const walletService_1 = __importDefault(require("../services/walletService"));
const response_1 = __importDefault(require("../utils/response"));
const event_listner_1 = require("../utils/event-listner");
class WalletController {
    async getUserWalletHistory(req, res, next) {
        try {
            const queryString = req.query;
            const { user } = req;
            const data = await walletService_1.default.getUserWalletHistory(user, queryString);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'User wallet history fetched successfully',
                pagination: data.pagination,
                result: data.data,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getDriverWalletHistory(req, res, next) {
        try {
            const queryString = req.query;
            const { user } = req;
            const data = await walletService_1.default.getDriverWalletHistory(user, queryString);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Driver wallet history fetched successfully',
                pagination: data.pagination,
                result: data.data,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async walletRecharge(req, res, next) {
        try {
            const { user } = req;
            const { notification, ...result } = await walletService_1.default.walletRecharge({ ...req.body, userId: user });
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Wallet recharged successfully',
                result,
            });
            event_listner_1.customEventEmitter.emit('notification', notification);
        }
        catch (error) {
            next(error);
        }
    }
}
const walletController = new WalletController();
exports.default = walletController;
