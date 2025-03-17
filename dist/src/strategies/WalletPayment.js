"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletPayment = void 0;
const userManagementService_1 = __importDefault(require("../services/userManagementService"));
const userService_1 = __importDefault(require("../services/userService"));
class WalletPayment {
    async processPayment(data) {
        const user = await userService_1.default.getUserById(data.userId);
        await userManagementService_1.default.checkBalanceAndUpdateWallet(user, data.amount, data.tripOrOfferId);
    }
}
exports.WalletPayment = WalletPayment;
