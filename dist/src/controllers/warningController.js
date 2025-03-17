"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_1 = __importDefault(require("../utils/response"));
const warningService_1 = __importDefault(require("../services/warningService"));
const event_listner_1 = require("../utils/event-listner");
const warnings_serialization_1 = require("../utils/serialization/warnings.serialization");
class WarningController {
    async getOne(req, res, next) {
        try {
            const { language } = req;
            const warning = await warningService_1.default.getOne(+req.params.id);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Warning found',
                result: (0, warnings_serialization_1.serializeWarning)(warning, language),
            });
        }
        catch (error) {
            next(error);
        }
    }
    async create(req, res, next) {
        try {
            const warning = await warningService_1.default.create(req.body);
            event_listner_1.customEventEmitter.emit('newWarning', warning);
            (0, response_1.default)(res, 201, {
                status: true,
                message: 'Warning created',
                result: warning,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            await warningService_1.default.delete(Number(req.params.id));
            (0, response_1.default)(res, 204, {
                status: true,
                message: 'Warning deleted',
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getAll(req, res, next) {
        try {
            const { language } = req;
            const warnings = await warningService_1.default.getAll(req.query);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Warnings found',
                result: (0, warnings_serialization_1.serializeWarnings)(warnings, language),
            });
        }
        catch (error) {
            next(error);
        }
    }
}
const warningController = new WarningController();
exports.default = warningController;
