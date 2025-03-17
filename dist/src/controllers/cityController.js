"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cityService_1 = __importDefault(require("../services/cityService"));
const response_1 = __importDefault(require("../utils/response"));
const city_serialization_1 = require("../utils/serialization/city.serialization");
class CityController {
    async create(req, res, next) {
        try {
            const city = await cityService_1.default.create(req.body);
            (0, response_1.default)(res, 201, {
                status: true,
                message: 'City created successfully',
                result: city,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getOne(req, res, next) {
        try {
            const city = await cityService_1.default.getOne(+req.params.id);
            const { language, skipLang } = req;
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'City feched successfully',
                result: skipLang ? city : (0, city_serialization_1.serializeCity)(city, language),
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getAll(req, res, next) {
        try {
            const cities = await cityService_1.default.getAll(req.query);
            const { language, skipLang } = req;
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Cities fetched successfully',
                pagination: cities.pagination,
                result: skipLang ? cities.data : (0, city_serialization_1.serializeCities)(cities.data, language),
            });
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const city = await cityService_1.default.update(+req.params.id, req.body);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'City updated successfully',
                result: city,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            await cityService_1.default.delete(+req.params.id);
            (0, response_1.default)(res, 204, {
                status: true,
                message: 'City deleted successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
}
const cityController = new CityController();
exports.default = cityController;
