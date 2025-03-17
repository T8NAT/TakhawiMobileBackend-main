"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const complaintService_1 = __importDefault(require("../services/complaintService"));
const response_1 = __importDefault(require("../utils/response"));
const roles_1 = require("../enum/roles");
class ComplaintController {
    async create(req, res, next) {
        try {
            const userId = req.user;
            req.body.userId = userId;
            const complaint = await complaintService_1.default.create(req.body);
            return (0, response_1.default)(res, 201, {
                status: true,
                message: 'Complaint created successfully',
                result: complaint,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getAll(req, res, next) {
        try {
            const complaints = await complaintService_1.default.getAll(req.query);
            return (0, response_1.default)(res, 200, {
                status: true,
                message: 'Complaints fetched successfully',
                pagination: complaints.pagination,
                result: complaints.data,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getOne(req, res, next) {
        try {
            const { user, role } = req;
            const complaint = await complaintService_1.default.getOne(+req.params.id, role === roles_1.Roles.USER || role === roles_1.Roles.DRIVER ? user : undefined);
            return (0, response_1.default)(res, 200, {
                status: true,
                message: 'Complaint fetched successfully',
                result: complaint,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const { user, role } = req;
            const complaint = await complaintService_1.default.update(+req.params.id, req.body, role === roles_1.Roles.USER || role === roles_1.Roles.DRIVER ? user : undefined);
            return (0, response_1.default)(res, 200, {
                status: true,
                message: 'Complaint updated successfully',
                result: complaint,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            const { user, role } = req;
            await complaintService_1.default.delete(+req.params.id, role === roles_1.Roles.USER || role === roles_1.Roles.DRIVER ? user : undefined);
            return (0, response_1.default)(res, 204, {
                status: true,
                message: 'Complaint deleted successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
}
const complaintController = new ComplaintController();
exports.default = complaintController;
