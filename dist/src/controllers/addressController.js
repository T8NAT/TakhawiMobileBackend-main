"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const addressService_1 = __importDefault(require("../services/addressService"));
const response_1 = __importDefault(require("../utils/response"));
class AddressController {
    async create(req, res, next) {
        try {
            const userId = req.user;
            const address = await addressService_1.default.create(req.body, userId);
            (0, response_1.default)(res, 201, {
                status: true,
                message: 'Address created successfully',
                result: address,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getOne(req, res, next) {
        try {
            const userId = req.user;
            const address = await addressService_1.default.getOne(+req.params.id, userId);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Address fetched successfully',
                result: address,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getAll(req, res, next) {
        try {
            const userId = req.user;
            const addresses = await addressService_1.default.getAll(userId, req.query.is_favorite);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Addresses fetched successfully',
                result: addresses,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getAllAddresses(req, res, next) {
        try {
            const userId = req.query.userId ? req.query.userId : undefined;
            const addresses = await addressService_1.default.getAllAddresses(req.query, +userId);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Addresses fetched successfully',
                pagination: addresses.pagination,
                result: addresses.data,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const userId = req.user;
            const address = await addressService_1.default.update(+req.params.id, req.body, userId);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Address updated successfully',
                result: address,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            const userId = req.user;
            await addressService_1.default.delete(+req.params.id, userId);
            (0, response_1.default)(res, 204, {
                status: true,
                message: 'Address deleted successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
}
const addressController = new AddressController();
exports.default = addressController;
