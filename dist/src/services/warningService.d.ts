import { IWarningSarvice } from '../interfaces/warningService';
import { CreateWarningType, Warning, WarningQueryType } from '../types/warningType';
declare class WarningService implements IWarningSarvice {
    getOne(id: number): Promise<Warning>;
    create(data: CreateWarningType): Promise<Warning>;
    delete(id: number): Promise<void>;
    getAll(location: WarningQueryType): Promise<Warning[]>;
    deleteExpiredWarnings(): Promise<void>;
}
declare const warningService: WarningService;
export default warningService;
