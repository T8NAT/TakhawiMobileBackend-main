import { IReasonService } from '../interfaces/reasonService';
import { CreateReason, Reason, UpdateReason } from '../types/reasonType';
declare class ReasonService implements IReasonService {
    create(reason: CreateReason): Promise<Reason>;
    getOne(id: number): Promise<Reason>;
    getAll(): Promise<Reason[]>;
    update(id: number, reason: UpdateReason): Promise<Reason>;
    delete(id: number): Promise<Reason>;
}
declare const reasonService: ReasonService;
export default reasonService;
