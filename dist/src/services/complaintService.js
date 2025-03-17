"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __importDefault(require("../../prisma/client"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const pagination_1 = require("../utils/pagination");
class ComplaintService {
    async create(data) {
        return client_1.default.complaint.create({
            data,
        });
    }
    async getAll(queryString) {
        return (0, pagination_1.paginate)('complaint', {}, queryString.page, queryString.limit);
    }
    async getOne(id, userId) {
        const complaint = await client_1.default.complaint.findUnique({
            where: {
                id,
                userId,
            },
        });
        if (!complaint)
            throw new ApiError_1.default('Complaint not found', 404);
        return complaint;
    }
    async update(id, data, userId) {
        await this.getOne(id, userId);
        return client_1.default.complaint.update({
            where: {
                id,
            },
            data,
        });
    }
    async delete(id, userId) {
        await this.getOne(id, userId);
        await client_1.default.complaint.delete({
            where: {
                id,
            },
        });
    }
}
const complaintService = new ComplaintService();
exports.default = complaintService;
