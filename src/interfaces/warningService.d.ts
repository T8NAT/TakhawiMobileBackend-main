import {
  Warning,
  CreateWarningType,
  WarningQueryType,
} from '../types/warningType';

export interface IWarningSarvice {
  create(data: CreateWarningType): Promise<Warning>;
  getOne(id: number): Promise<Warning>;
  getAll(location: WarningQueryType): Promise<Warning[]>;
  delete(id: number): Promise<void>;
}
