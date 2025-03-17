"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __importDefault(require("../../prisma/client"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const pagination_1 = require("../utils/pagination");
class AddressService {
    async create(data, userId) {
        return client_1.default.address.upsert({
            where: {
                Unique_Address: {
                    lat: data.lat,
                    lng: data.lng,
                    userId,
                },
            },
            update: data,
            create: {
                ...data,
                userId,
            },
        });
    }
    async getOne(id, userId) {
        const address = await client_1.default.address.findUnique({
            where: {
                id,
                deletedAt: null,
                userId,
            },
        });
        if (!address)
            throw new ApiError_1.default('Address not found', 404);
        return address;
    }
    async getAll(userId, is_favorite) {
        return client_1.default.address.findMany({
            where: {
                userId,
                deletedAt: null,
                is_favorite: is_favorite ? is_favorite === 'true' : undefined,
            },
        });
    }
    async getAllAddresses(queryString, userId) {
        if (userId) {
            return (0, pagination_1.paginate)('address', { where: { userId, deletedAt: null } }, queryString.page, queryString.limit);
        }
        return (0, pagination_1.paginate)('address', { where: { deletedAt: null } });
    }
    async update(id, data, userId) {
        await this.getOne(id, userId);
        return client_1.default.address.update({
            where: {
                id,
                userId,
            },
            data,
        });
    }
    async delete(id, userId) {
        await this.getOne(id, userId);
        await client_1.default.address.update({
            where: {
                id,
                userId,
            },
            data: {
                deletedAt: new Date(),
            },
        });
    }
}
const addressService = new AddressService();
exports.default = addressService;
