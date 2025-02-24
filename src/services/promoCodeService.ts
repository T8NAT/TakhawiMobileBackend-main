import prisma from '../../prisma/client';
import { PromoCodeType } from '../enum/promoCode';
import { IPromoCodeService } from '../interfaces/promoCodeService';
import { PaginateType } from '../types/paginateType';
import {
  CreatePromoCode,
  PromoCode,
  PromoCodeQueryType,
  UpdatePromoCode,
} from '../types/promoCodeType';
import ApiError from '../utils/ApiError';
import { paginate } from '../utils/pagination';

class PromoCodeService implements IPromoCodeService {
  async create(data: CreatePromoCode): Promise<PromoCode> {
    const existedPromoCode = await this.getPromoByCode(data.code);
    if (existedPromoCode) {
      throw new ApiError('Promo code already existed', 400);
    }
    return prisma.promo_Code.create({ data });
  }

  async getAll(
    queryString: PromoCodeQueryType,
  ): Promise<PaginateType<PromoCode>> {
    return paginate(
      'promo_Code',
      { where: { deletedAt: null } },
      queryString.page,
      queryString.limit,
    );
  }

  async getOne(id: number): Promise<PromoCode> {
    const promoCode = await prisma.promo_Code.findUnique({ where: { id } });
    if (!promoCode) {
      throw new ApiError('Promo code not found', 404);
    }
    return promoCode;
  }

  async update(id: number, data: UpdatePromoCode): Promise<PromoCode> {
    await this.validateUpdatePromoCodeBody(id, data);
    return prisma.promo_Code.update({ where: { id }, data });
  }

  async delete(id: number): Promise<void> {
    await this.getOne(id);
    await prisma.promo_Code.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async getPromoByCode(code: string): Promise<PromoCode | null> {
    return prisma.promo_Code.findFirst({ where: { code, deletedAt: null } });
  }

  async checkPromoCode(code: string, userId: number): Promise<PromoCode> {
    const promoCode = await this.getPromoByCode(code);
    const currentDate = new Date();
    if (!promoCode) {
      throw new ApiError('Promo code is not valid', 400);
    }
    const userTimeUsed = await prisma.used_Promo_Code.count({
      where: { promo_code_id: promoCode.id, userId },
    });
    if (
      !promoCode.is_active ||
      promoCode.from > currentDate ||
      promoCode.to < currentDate ||
      promoCode.limit <= promoCode.time_used ||
      promoCode.limit_per_user <= userTimeUsed
    ) {
      throw new ApiError('Promo code is not valid', 400);
    }
    return promoCode;
  }

  async applyPromoCode(code: string, userId: number, amount: number) {
    const promoCode = await this.checkPromoCode(code, userId);
    let discount = 0;
    if (promoCode.type === PromoCodeType.PERCENTAGE) {
      const discountAmount = amount * (promoCode.amount / 100);
      discount =
        promoCode.max_discount && discountAmount > promoCode.max_discount
          ? promoCode.max_discount
          : discountAmount;
    } else {
      promoCode.amount > amount
        ? (discount = amount)
        : (discount = promoCode.amount);
    }
    return { discount, promoCodeId: promoCode.id };
  }

  private async validateUpdatePromoCodeBody(
    id: number,
    data: UpdatePromoCode,
  ): Promise<void> {
    const promoCode = await this.getOne(id);
    if (
      data.amount &&
      data.amount > 100 &&
      (!data.type ||
        (data.type !== PromoCodeType.FIXED &&
          promoCode.type === PromoCodeType.PERCENTAGE))
    ) {
      throw new ApiError(
        'Amount must be at most 100 in case of percentage',
        400,
      );
    } else if (
      data.type &&
      data.type === PromoCodeType.PERCENTAGE &&
      ((!data.amount && promoCode.amount > 100) ||
        (data.amount && data.amount > 100))
    ) {
      throw new ApiError(
        `Amount must be at most 100 in case of ${PromoCodeType.PERCENTAGE}.`,
        400,
      );
    } else if (data.from && !data.to && new Date(data.from) > promoCode.to) {
      throw new ApiError('To must be after from.', 400);
    } else if (data.to && !data.from && new Date(data.to) < promoCode.from) {
      throw new ApiError('To must be after from.', 400);
    } else if (
      data.to &&
      data.from &&
      new Date(data.from) > new Date(data.to)
    ) {
      throw new ApiError('To must be after from.', 400);
    }
  }
}

const promoCodeService = new PromoCodeService();
export default promoCodeService;
