import { IComplaintService } from '../interfaces/complaintService';
import {
  CreateComplaint,
  Complaint,
  UpdateComplaint,
  ComplaintQueryType,
} from '../types/complaint';
import prisma from '../../prisma/client';
import ApiError from '../utils/ApiError';
import { PaginateType } from '../types/paginateType';
import { paginate } from '../utils/pagination';

class ComplaintService implements IComplaintService {
  async create(data: CreateComplaint): Promise<Complaint> {
    return prisma.complaint.create({
      data,
    });
  }

  async getAll(
    queryString: ComplaintQueryType,
  ): Promise<PaginateType<Complaint>> {
    return paginate('complaint', {}, queryString.page, queryString.limit);
  }

  async getOne(id: number, userId?: number): Promise<Complaint> {
    const complaint = await prisma.complaint.findUnique({
      where: {
        id,
        userId,
      },
    });
    if (!complaint) throw new ApiError('Complaint not found', 404);
    return complaint;
  }

  async update(
    id: number,
    data: UpdateComplaint,
    userId?: number,
  ): Promise<Complaint> {
    await this.getOne(id, userId);
    return prisma.complaint.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id: number, userId?: number): Promise<void> {
    await this.getOne(id, userId);
    await prisma.complaint.delete({
      where: {
        id,
      },
    });
  }
}

const complaintService = new ComplaintService();
export default complaintService;
