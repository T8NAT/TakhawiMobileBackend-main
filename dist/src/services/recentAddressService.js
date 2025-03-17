"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __importDefault(require("../../prisma/client"));
class RecentAddressService {
    async create(data) {
        const addresses = await this.getAll(data.userId);
        if (addresses.length >= 10) {
            await this.delete(addresses[addresses.length - 1].id);
        }
        return client_1.default.recent_Address.create({
            data,
        });
    }
    async getAll(userId) {
        return client_1.default.recent_Address.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
    }
    async delete(id) {
        await client_1.default.recent_Address.delete({
            where: { id },
        });
    }
}
const recentAddressService = new RecentAddressService();
exports.default = recentAddressService;
