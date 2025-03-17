"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_1 = __importDefault(require("../utils/response"));
const reasonService_1 = __importDefault(require("../services/reasonService"));
const reason_serialization_1 = require("../utils/serialization/reason.serialization");
class ReasonController {
    async create(req, res, next) {
        try {
            const reason = await reasonService_1.default.create(req.body);
            return (0, response_1.default)(res, 201, {
                status: true,
                message: 'Reason created successfully',
                result: reason,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getAll(req, res, next) {
        try {
            const reasons = await reasonService_1.default.getAll();
            const { language, skipLang } = req;
            return (0, response_1.default)(res, 200, {
                status: true,
                message: 'Reasons fetched successfully',
                result: skipLang ? reasons : (0, reason_serialization_1.serializeReasons)(reasons, language),
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getOne(req, res, next) {
        try {
            const reason = await reasonService_1.default.getOne(+req.params.id);
            const { language, skipLang } = req;
            return (0, response_1.default)(res, 200, {
                status: true,
                message: 'Reason fetched successfully',
                result: skipLang ? reason : (0, reason_serialization_1.serializeReason)(reason, language),
            });
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const reason = await reasonService_1.default.update(+req.params.id, req.body);
            return (0, response_1.default)(res, 200, {
                status: true,
                message: 'Reason updated successfully',
                result: reason,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            await reasonService_1.default.delete(+req.params.id);
            return (0, response_1.default)(res, 204, {
                status: true,
                message: 'Reason deleted successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
}
const reasonController = new ReasonController();
exports.default = reasonController;
