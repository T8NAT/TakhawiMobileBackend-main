import { IPromoCodeService } from '../interfaces/promoCodeService';
import { PaginateType } from '../types/paginateType';
import { CreatePromoCode, PromoCode, PromoCodeQueryType, UpdatePromoCode } from '../types/promoCodeType';
declare class PromoCodeService implements IPromoCodeService {
    create(data: CreatePromoCode): Promise<PromoCode>;
    getAll(queryString: PromoCodeQueryType): Promise<PaginateType<PromoCode>>;
    getOne(id: number): Promise<PromoCode>;
    update(id: number, data: UpdatePromoCode): Promise<PromoCode>;
    delete(id: number): Promise<void>;
    getPromoByCode(code: string): Promise<PromoCode | null>;
    checkPromoCode(code: string, userId: number): Promise<PromoCode>;
    applyPromoCode(code: string, userId: number, amount: number): Promise<{
        discount: number;
        promoCodeId: number;
    }>;
    private validateUpdatePromoCodeBody;
}
declare const promoCodeService: PromoCodeService;
export default promoCodeService;
