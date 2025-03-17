import ISettlementRequestService from '../interfaces/settlementService';
import ISettlementRequest, { CreateSettlementRequest, SettlementRequestQuery } from '../types/settlementRequestType';
import { PaginateType } from '../types/paginateType';
declare class SettlementRequestService implements ISettlementRequestService {
    create(data: CreateSettlementRequest): Promise<ISettlementRequest>;
    getAll(query: SettlementRequestQuery): Promise<PaginateType<ISettlementRequest>>;
    getOne(id: number, userId?: number): Promise<ISettlementRequest>;
    cancel(id: number, userId: number): Promise<void>;
    approve(id: number, userId?: number): Promise<void>;
    deny(id: number, userId?: number): Promise<void>;
    private checkRequest;
}
declare const settlementRequestService: SettlementRequestService;
export default settlementRequestService;
