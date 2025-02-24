import {
  Complain,
  CreateComplain,
  UpdateComplain,
  ComplaintQueryType,
} from '../types/complaint';
import { PaginateType } from '../types/paginateType';

export interface IComplaintService {
  create(data: CreateComplain): Promise<Complain>;
  getAll(queryString: ComplaintQueryType): Promise<PaginateType<Complain>>;
  getOne(id: number, userId?: number): Promise<Complain>;
  update(id: number, data: UpdateComplain, userId?: number): Promise<Complain>;
  delete(id: number, userId?: number): Promise<void>;
}
