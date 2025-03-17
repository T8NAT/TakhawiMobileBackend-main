"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hobbyService_1 = __importDefault(require("../services/hobbyService"));
const hobbies_serialization_1 = require("../utils/serialization/hobbies.serialization");
const response_1 = __importDefault(require("../utils/response"));
class HobbyController {
    async create(req, res, next) {
        try {
            const hobby = await hobbyService_1.default.create(req.body);
            (0, response_1.default)(res, 201, {
                status: true,
                message: 'Hobby created successfully',
                result: hobby,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getOne(req, res, next) {
        try {
            const hobby = await hobbyService_1.default.getOne(+req.params.id);
            const { language, skipLang } = req;
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Hobby fetched successfully',
                result: skipLang ? hobby : (0, hobbies_serialization_1.serializeHobby)(hobby, language),
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getAll(req, res, next) {
        try {
            const hoppies = await hobbyService_1.default.getAll(req.query);
            const { language, skipLang } = req;
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Hoppies fetched successfully',
                pagination: hoppies.pagination,
                result: skipLang
                    ? hoppies.data
                    : (0, hobbies_serialization_1.serializeHobbies)(hoppies.data, language),
            });
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const hobby = await hobbyService_1.default.update(+req.params.id, req.body);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Hobby updated successfully',
                result: hobby,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            await hobbyService_1.default.delete(+req.params.id);
            (0, response_1.default)(res, 204, {
                status: true,
                message: 'Hobby deleted successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
}
const hobbyController = new HobbyController();
exports.default = hobbyController;
