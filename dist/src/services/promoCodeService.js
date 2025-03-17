"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __importDefault(require("../../prisma/client"));
const promoCode_1 = require("../enum/promoCode");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const pagination_1 = require("../utils/pagination");
class PromoCodeService {
    async create(data) {
        const existedPromoCode = await this.getPromoByCode(data.code);
        if (existedPromoCode) {
            throw new ApiError_1.default('Promo code already existed', 400);
        }
        return client_1.default.promo_Code.create({ data });
    }
    async getAll(queryString) {
        return (0, pagination_1.paginate)('promo_Code', { where: { deletedAt: null } }, queryString.page, queryString.limit);
    }
    async getOne(id) {
        const promoCode = await client_1.default.promo_Code.findUnique({ where: { id } });
        if (!promoCode) {
            throw new ApiError_1.default('Promo code not found', 404);
        }
        return promoCode;
    }
    async update(id, data) {
        await this.validateUpdatePromoCodeBody(id, data);
        return client_1.default.promo_Code.update({ where: { id }, data });
    }
    async delete(id) {
        await this.getOne(id);
        await client_1.default.promo_Code.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
    async getPromoByCode(code) {
        return client_1.default.promo_Code.findFirst({ where: { code, deletedAt: null } });
    }
    async checkPromoCode(code, userId) {
        const promoCode = await this.getPromoByCode(code);
        const currentDate = new Date();
        if (!promoCode) {
            throw new ApiError_1.default('Promo code is not valid', 400);
        }
        const userTimeUsed = await client_1.default.used_Promo_Code.count({
            where: { promo_code_id: promoCode.id, userId },
        });
        if (!promoCode.is_active
            || promoCode.from > currentDate
            || promoCode.to < currentDate
            || promoCode.limit <= promoCode.time_used
            || promoCode.limit_per_user <= userTimeUsed) {
            throw new ApiError_1.default('Promo code is not valid', 400);
        }
        return promoCode;
    }
    async applyPromoCode(code, userId, amount) {
        const promoCode = await this.checkPromoCode(code, userId);
        let discount = 0;
        if (promoCode.type === promoCode_1.PromoCodeType.PERCENTAGE) {
            const discountAmount = amount * (promoCode.amount / 100);
            discount = promoCode.max_discount && discountAmount > promoCode.max_discount
                ? promoCode.max_discount
                : discountAmount;
        }
        else {
            promoCode.amount > amount
                ? (discount = amount)
                : (discount = promoCode.amount);
        }
        return { discount, promoCodeId: promoCode.id };
    }
    async validateUpdatePromoCodeBody(id, data) {
        const promoCode = await this.getOne(id);
        if (data.amount
            && data.amount > 100
            && (!data.type
                || (data.type !== promoCode_1.PromoCodeType.FIXED
                    && promoCode.type === promoCode_1.PromoCodeType.PERCENTAGE))) {
            throw new ApiError_1.default('Amount must be at most 100 in case of percentage', 400);
        }
        else if (data.type
            && data.type === promoCode_1.PromoCodeType.PERCENTAGE
            && ((!data.amount && promoCode.amount > 100)
                || (data.amount && data.amount > 100))) {
            throw new ApiError_1.default(`Amount must be at most 100 in case of ${promoCode_1.PromoCodeType.PERCENTAGE}.`, 400);
        }
        else if (data.from && !data.to && new Date(data.from) > promoCode.to) {
            throw new ApiError_1.default('To must be after from.', 400);
        }
        else if (data.to && !data.from && new Date(data.to) < promoCode.from) {
            throw new ApiError_1.default('To must be after from.', 400);
        }
        else if (data.to
            && data.from
            && new Date(data.from) > new Date(data.to)) {
            throw new ApiError_1.default('To must be after from.', 400);
        }
    }
}
const promoCodeService = new PromoCodeService();
exports.default = promoCodeService;
