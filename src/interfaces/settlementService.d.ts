import { PaginateType } from '../types/paginateType';
import ISettlementRequest from '../types/settlementRequestType';

export default interface ISettlementRequestService {
  create(data: CreateSettlementRequest): Promise<ISettlementRequest>;
  getAll(
    query: SettlementRequestQuery,
  ): Promise<PaginateType<ISettlementRequest>>;
  getOne(id: number, userId?: number): Promise<ISettlementRequest>;
  cancel(id: number, userId: number): Promise<void>;
  approve(id: number, userId?: number): Promise<void>;
  deny(id: number, userId?: number): Promise<void>;
}
