"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_1 = __importDefault(require("../utils/response"));
const mettingLocationService_1 = __importDefault(require("../services/mettingLocationService"));
const meetingLocation_serialization_1 = require("../utils/serialization/meetingLocation.serialization");
class MeetingLocationController {
    async create(req, res, next) {
        try {
            const meetingLocation = await mettingLocationService_1.default.create(req.body);
            (0, response_1.default)(res, 201, {
                status: true,
                message: 'Meeting location created successfully',
                result: meetingLocation,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getOne(req, res, next) {
        try {
            const meetingLocation = await mettingLocationService_1.default.getOne(+req.params.id);
            const { language, skipLang } = req;
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Meeting location fetched successfully',
                result: skipLang
                    ? meetingLocation
                    : (0, meetingLocation_serialization_1.serializeMeetingLocation)(meetingLocation, language),
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getAll(req, res, next) {
        try {
            const meetingLocations = await mettingLocationService_1.default.getAll();
            const { language, skipLang } = req;
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Meeting locations fetched successfully',
                result: skipLang
                    ? meetingLocations
                    : (0, meetingLocation_serialization_1.serializeMeetingLocations)(meetingLocations, language),
            });
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const meetingLocation = await mettingLocationService_1.default.update(+req.params.id, req.body);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Meeting location updated successfully',
                result: meetingLocation,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            await mettingLocationService_1.default.delete(+req.params.id);
            (0, response_1.default)(res, 204, { status: true, message: 'Meeting location deleted successfully' });
        }
        catch (error) {
            next(error);
        }
    }
}
const meetingLocationController = new MeetingLocationController();
exports.default = meetingLocationController;
