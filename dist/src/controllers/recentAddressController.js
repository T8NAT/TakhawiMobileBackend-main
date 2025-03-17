"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const recentAddressService_1 = __importDefault(require("../services/recentAddressService"));
const response_1 = __importDefault(require("../utils/response"));
class RecentAddressController {
    async create(req, res, next) {
        try {
            const { user } = req;
            const recentAddress = await recentAddressService_1.default.create({
                ...req.body,
                userId: user,
            });
            (0, response_1.default)(res, 201, {
                status: true,
                message: 'Recent address created successfully',
                result: recentAddress,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getAll(req, res, next) {
        try {
            const { user } = req;
            const recentAddresses = await recentAddressService_1.default.getAll(user);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Recent addresses fetched successfully',
                result: recentAddresses,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            const { id } = req.params;
            await recentAddressService_1.default.delete(+id);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Recent address deleted successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
}
const recentAddressController = new RecentAddressController();
exports.default = recentAddressController;
