"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginate = void 0;
const client_1 = __importDefault(require("../../prisma/client"));
const paginate = async (model, customFilter = {}, page = 1, limit = 40) => {
    const offset = (page - 1) * limit;
    // @ts-ignore
    const data = await client_1.default[model].findMany({
        ...customFilter,
        skip: +offset,
        take: +limit,
    });
    // Pass the where clause only to the count method
    const { where } = customFilter;
    // @ts-ignore
    const total = await client_1.default[model].count({ where });
    return {
        pagination: {
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            page: +page,
            limit: +limit,
        },
        data,
    };
};
exports.paginate = paginate;
