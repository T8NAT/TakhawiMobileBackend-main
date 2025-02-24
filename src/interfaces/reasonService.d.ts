import { CreateReason, Reason, UpdateReason } from '../types/reasonType';

export interface IReasonService {
  create(reason: CreateReason): Promise<Reason>;
  getOne(id: number): Promise<Reason>;
  getAll(): Promise<Reason[]>;
  update(id: number, reason: UpdateReason): Promise<Reason>;
  delete(id: number): Promise<Reason>;
}
