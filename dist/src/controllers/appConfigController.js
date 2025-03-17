"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_1 = __importDefault(require("../utils/response"));
const appconfigService_1 = __importDefault(require("../services/appconfigService"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
class AppConfigController {
    async create(req, res, next) {
        try {
            if (req.body.type === 'IMAGE') {
                if (!req.file) {
                    throw new ApiError_1.default('Please upload a file', 400);
                }
                req.body.value = req.file.path;
            }
            const appConfig = await appconfigService_1.default.create(req.body);
            (0, response_1.default)(res, 201, {
                status: true,
                message: 'AppConfig created successfully',
                result: appConfig,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getAll(req, res, next) {
        try {
            const appConfigs = await appconfigService_1.default.getAll(req.query.type);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'All appConfigs fetched successfully',
                result: appConfigs,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            await appconfigService_1.default.delete(+req.params.id);
            (0, response_1.default)(res, 204, {
                status: true,
                message: 'AppConfig deleted successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
}
const appConfigController = new AppConfigController();
exports.default = appConfigController;
