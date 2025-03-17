"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const client_1 = __importDefault(require("../../prisma/client"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
class WarningService {
    async getOne(id) {
        const warning = await client_1.default.warning.findUnique({
            where: {
                id,
            },
        });
        if (!warning)
            throw new ApiError_1.default('No warning found', 404);
        return warning;
    }
    create(data) {
        const warning = client_1.default.warning.create({
            data: {
                ...data,
                expiration_date: (0, moment_1.default)().add(1, 'days').toDate(),
            },
        });
        return warning;
    }
    async delete(id) {
        await this.getOne(id);
        await client_1.default.warning.delete({
            where: {
                id,
            },
        });
    }
    getAll(location) {
        return client_1.default.$queryRaw `
      SELECT *
      FROM (
        SELECT id, ar_type, en_type, location,
          2 * 6371 * asin(
            sqrt(
              (sin(radians((CAST(location->>'lat' AS FLOAT) - ${+location.lat}) / 2))) ^ 2
              + cos(radians(${+location.lat})) * cos(radians(CAST(location->>'lat' AS FLOAT)))
              * (sin(radians((CAST(location->>'lng' AS FLOAT) - ${+location.lng}) / 2))) ^ 2
            )
          ) as distance
        FROM "Warning"
      ) AS subquery
      WHERE distance < 10
      ORDER BY distance
    `;
    }
    async deleteExpiredWarnings() {
        await client_1.default.warning.deleteMany({
            where: {
                expiration_date: {
                    lte: new Date(),
                },
            },
        });
    }
}
const warningService = new WarningService();
exports.default = warningService;
