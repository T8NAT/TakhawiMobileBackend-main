import { IReasonService } from '../interfaces/reasonService';
import { CreateReason, Reason, UpdateReason } from '../types/reasonType';
import prisma from '../../prisma/client';
import ApiError from '../utils/ApiError';

class ReasonService implements IReasonService {
  async create(reason: CreateReason): Promise<Reason> {
    return prisma.reason.create({ data: reason });
  }

  async getOne(id: number): Promise<Reason> {
    const reason = await prisma.reason.findUnique({ where: { id } });
    if (!reason) throw new ApiError('Reason not found', 404);
    return reason;
  }

  async getAll(): Promise<Reason[]> {
    return prisma.reason.findMany({ where: { deletedAt: null } });
  }

  async update(id: number, reason: UpdateReason): Promise<Reason> {
    await this.getOne(id);
    return prisma.reason.update({ where: { id }, data: reason });
  }

  async delete(id: number): Promise<Reason> {
    await this.getOne(id);
    return prisma.reason.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

const reasonService = new ReasonService();
export default reasonService;
