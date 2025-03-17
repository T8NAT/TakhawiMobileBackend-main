"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __importDefault(require("../../prisma/client"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const pagination_1 = require("../utils/pagination");
const roles_1 = require("../enum/roles");
class IssueService {
    async create(issue) {
        await this.checkTripAndReasonExist(issue.reasonId, issue.tripId);
        return client_1.default.issue.create({ data: issue });
    }
    async getOne(id) {
        const issue = await client_1.default.issue.findUnique({ where: { id } });
        if (!issue)
            throw new ApiError_1.default('Issue not found', 404);
        return issue;
    }
    async getAll(id, role, queryString) {
        const { page, limit, reasonId, tripId, userId, } = queryString;
        return (0, pagination_1.paginate)('issue', {
            where: role === roles_1.Roles.SUPER_ADMIN || roles_1.Roles.ADMIN ? {
                deletedAt: null,
                reasonId: reasonId ? +reasonId : undefined,
                tripId: tripId ? +tripId : undefined,
                userId: userId ? +userId : undefined,
            } : {
                userId: id,
                deletedAt: null,
            },
        }, page, limit);
    }
    async update(id, issue) {
        await this.getOne(id);
        if (issue.reasonId)
            await this.checkTripAndReasonExist(issue.reasonId);
        return client_1.default.issue.update({ where: { id }, data: issue });
    }
    async delete(id) {
        await this.getOne(id);
        await client_1.default.issue.delete({ where: { id } });
    }
    async checkTripAndReasonExist(reasonId, tripId) {
        const reason = await client_1.default.reason.findUnique({ where: { id: reasonId, deletedAt: null } });
        if (!reason)
            throw new ApiError_1.default('Reason not found', 404);
        if (tripId) {
            const trip = await client_1.default.trip.findUnique({ where: { id: tripId, deletedAt: null } });
            if (!trip)
                throw new ApiError_1.default('Trip not found', 404);
        }
    }
}
const issueService = new IssueService();
exports.default = issueService;
