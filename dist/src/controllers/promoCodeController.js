"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promoCodeService_1 = __importDefault(require("../services/promoCodeService"));
const response_1 = __importDefault(require("../utils/response"));
class PromoCodeController {
    async create(req, res, next) {
        try {
            const promoCode = await promoCodeService_1.default.create(req.body);
            (0, response_1.default)(res, 201, {
                status: true,
                message: 'Promo code created successfully',
                result: promoCode,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getAll(req, res, next) {
        try {
            const promoCodes = await promoCodeService_1.default.getAll(req.query);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Promo codes fetched successfully',
                pagination: promoCodes.pagination,
                result: promoCodes.data,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getOne(req, res, next) {
        try {
            const promoCode = await promoCodeService_1.default.getOne(+req.params.id);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Promo code fetched successfully',
                result: promoCode,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const promoCode = await promoCodeService_1.default.update(+req.params.id, req.body);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Promo code updated successfully',
                result: promoCode,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            await promoCodeService_1.default.delete(+req.params.id);
            (0, response_1.default)(res, 204, {
                status: true,
                message: 'Promo code deleted successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
    async checkPromoCode(req, res, next) {
        try {
            const userId = req.user;
            const promoCode = await promoCodeService_1.default.checkPromoCode(req.body.code, userId);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Promo code is valid',
                result: promoCode,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
const promoCodeController = new PromoCodeController();
exports.default = promoCodeController;
