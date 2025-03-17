"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __importDefault(require("../../prisma/client"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
class MeetingLocationService {
    async create(data) {
        return client_1.default.meeting_Location.create({ data });
    }
    async getOne(id) {
        const meetingLocation = await client_1.default.meeting_Location.findUnique({
            where: { id },
            include: {
                City: true,
            },
        });
        if (!meetingLocation)
            throw new ApiError_1.default('Meeting location not found', 404);
        return meetingLocation;
    }
    async getAll() {
        return client_1.default.meeting_Location.findMany({ where: { deletedAt: null } });
    }
    async update(id, data) {
        await this.getOne(id);
        return client_1.default.meeting_Location.update({ where: { id }, data });
    }
    async delete(id) {
        await this.getOne(id);
        await client_1.default.meeting_Location.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
}
const meetingLocationService = new MeetingLocationService();
exports.default = meetingLocationService;
