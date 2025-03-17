"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __importDefault(require("../../prisma/client"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
class ReasonService {
    async create(reason) {
        return client_1.default.reason.create({ data: reason });
    }
    async getOne(id) {
        const reason = await client_1.default.reason.findUnique({ where: { id } });
        if (!reason)
            throw new ApiError_1.default('Reason not found', 404);
        return reason;
    }
    async getAll() {
        return client_1.default.reason.findMany({ where: { deletedAt: null } });
    }
    async update(id, reason) {
        await this.getOne(id);
        return client_1.default.reason.update({ where: { id }, data: reason });
    }
    async delete(id) {
        await this.getOne(id);
        return client_1.default.reason.update({ where: { id }, data: { deletedAt: new Date() } });
    }
}
const reasonService = new ReasonService();
exports.default = reasonService;
