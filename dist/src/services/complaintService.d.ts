import { IComplaintService } from '../interfaces/complaintService';
import { CreateComplaint, Complaint, UpdateComplaint, ComplaintQueryType } from '../types/complaint';
import { PaginateType } from '../types/paginateType';
declare class ComplaintService implements IComplaintService {
    create(data: CreateComplaint): Promise<Complaint>;
    getAll(queryString: ComplaintQueryType): Promise<PaginateType<Complaint>>;
    getOne(id: number, userId?: number): Promise<Complaint>;
    update(id: number, data: UpdateComplaint, userId?: number): Promise<Complaint>;
    delete(id: number, userId?: number): Promise<void>;
}
declare const complaintService: ComplaintService;
export default complaintService;
