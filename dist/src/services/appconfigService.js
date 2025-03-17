"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __importDefault(require("../../prisma/client"));
const fileHandler_1 = require("../utils/fileHandler");
class AppConfigService {
    async create(data) {
        return client_1.default.app_Config.create({ data });
    }
    async getAll(type) {
        return client_1.default.app_Config.findMany({ where: { type } });
    }
    async delete(id) {
        const appConfig = await client_1.default.app_Config.findUnique({ where: { id } });
        if (!appConfig) {
            throw new Error('App Config not found');
        }
        if (appConfig.type === 'IMAGE') {
            (0, fileHandler_1.removeFile)(appConfig.value);
        }
        await client_1.default.app_Config.delete({ where: { id } });
    }
}
const appConfigService = new AppConfigService();
exports.default = appConfigService;
