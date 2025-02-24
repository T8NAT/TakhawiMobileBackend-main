import { PaginateType } from '../types/paginateType';
import {
  CreatePromoCode,
  PromoCode,
  UpdatePromoCode,
  PromoCodeQueryType,
} from '../types/promoCodeType';

export interface IPromoCodeService {
  create(data: CreatePromoCode): Promise<PromoCode>;
  getAll(queryString: PromoCodeQueryType): Promise<PaginateType<PromoCode>>;
  getOne(id: number): Promise<PromoCode>;
  update(id: number, data: UpdatePromoCode): Promise<PromoCode>;
  delete(id: number): Promise<void>;
  getPromoByCode(code: string): Promise<PromoCode | null>;
  checkPromoCode(code: string, userId: number): Promise<PromoCode>;
}
