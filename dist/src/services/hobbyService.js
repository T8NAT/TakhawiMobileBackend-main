"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __importDefault(require("../../prisma/client"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const pagination_1 = require("../utils/pagination");
class HobbyService {
    async create(data) {
        return client_1.default.hobbies.create({ data });
    }
    async getOne(id) {
        const hobby = await client_1.default.hobbies.findUnique({ where: { id } });
        if (!hobby) {
            throw new ApiError_1.default('Hobby not found', 404);
        }
        return hobby;
    }
    async getAll(queryString) {
        return (0, pagination_1.paginate)('hobbies', {}, queryString.page, queryString.limit);
    }
    async update(id, data) {
        await this.getOne(id);
        return client_1.default.hobbies.update({ where: { id }, data });
    }
    async delete(id) {
        await this.getOne(id);
        await client_1.default.hobbies.delete({
            where: {
                id,
            },
        });
    }
}
const hobbyService = new HobbyService();
exports.default = hobbyService;
