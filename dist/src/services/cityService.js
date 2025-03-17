"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __importDefault(require("../../prisma/client"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const pagination_1 = require("../utils/pagination");
class CityService {
    async create(data) {
        return client_1.default.city.create({
            data,
        });
    }
    async getOne(id) {
        const city = await client_1.default.city.findUnique({
            where: {
                id,
            },
        });
        if (!city)
            throw new ApiError_1.default('City not found', 404);
        return city;
    }
    async getAll(queryString) {
        return (0, pagination_1.paginate)('city', { where: { deletedAt: null } }, queryString.page, queryString.limit);
    }
    async update(id, data) {
        await this.getOne(id);
        return client_1.default.city.update({
            where: {
                id,
            },
            data,
        });
    }
    async delete(id) {
        await this.getOne(id);
        await client_1.default.city.update({
            where: {
                id,
            },
            data: {
                deletedAt: new Date(),
            },
        });
    }
}
const cityService = new CityService();
exports.default = cityService;
