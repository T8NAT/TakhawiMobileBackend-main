"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const issueService_1 = __importDefault(require("../services/issueService"));
const response_1 = __importDefault(require("../utils/response"));
class IssueController {
    async create(req, res, next) {
        try {
            const userId = req.user;
            req.body.userId = userId;
            const issue = await issueService_1.default.create(req.body);
            (0, response_1.default)(res, 201, {
                status: true,
                message: 'Issue created successfully',
                result: issue,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getOne(req, res, next) {
        try {
            const issue = await issueService_1.default.getOne(+req.params.id);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Issue fetched successfully',
                result: issue,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getAll(req, res, next) {
        try {
            const { role } = req;
            const userId = req.user;
            const issues = await issueService_1.default.getAll(userId, role, req.query);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Issues fetched successfully',
                pagination: issues.pagination,
                result: issues.data,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const issue = await issueService_1.default.update(+req.params.id, req.body);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Issue updated successfully',
                result: issue,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            await issueService_1.default.delete(+req.params.id);
            (0, response_1.default)(res, 204, { status: true, message: 'Issue deleted successfully' });
        }
        catch (error) {
            next(error);
        }
    }
}
const issueController = new IssueController();
exports.default = issueController;
