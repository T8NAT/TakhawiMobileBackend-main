import { IIssueService } from '../interfaces/issueService';
import prisma from '../../prisma/client';
import ApiError from '../utils/ApiError';
import {
  CreateIssue,
  UpdateIssue,
  Issue,
  IssyeTypeQuery,
} from '../types/issueType';
import { paginate } from '../utils/pagination';
import { PaginateType } from '../types/paginateType';
import { Roles } from '../enum/roles';

class IssueService implements IIssueService {
  async create(issue: CreateIssue): Promise<Issue> {
    await this.checkTripAndReasonExist(issue.reasonId, issue.tripId);
    return prisma.issue.create({ data: issue });
  }

  async getOne(id: number): Promise<Issue> {
    const issue = await prisma.issue.findUnique({ where: { id } });
    if (!issue) throw new ApiError('Issue not found', 404);
    return issue;
  }

  async getAll(
    id: number,
    role: string,
    queryString: IssyeTypeQuery,
  ): Promise<PaginateType<Issue>> {
    const { page, limit, reasonId, tripId, userId } = queryString;
    return paginate(
      'issue',
      {
        where:
          role === Roles.SUPER_ADMIN || Roles.ADMIN
            ? {
                deletedAt: null,
                reasonId: reasonId ? +reasonId : undefined,
                tripId: tripId ? +tripId : undefined,
                userId: userId ? +userId : undefined,
              }
            : {
                userId: id,
                deletedAt: null,
              },
      },
      page,
      limit,
    );
  }

  async update(id: number, issue: UpdateIssue): Promise<Issue> {
    await this.getOne(id);
    if (issue.reasonId) await this.checkTripAndReasonExist(issue.reasonId);
    return prisma.issue.update({ where: { id }, data: issue });
  }

  async delete(id: number): Promise<void> {
    await this.getOne(id);
    await prisma.issue.delete({ where: { id } });
  }

  async checkTripAndReasonExist(
    reasonId: number,
    tripId?: number,
  ): Promise<void> {
    const reason = await prisma.reason.findUnique({
      where: { id: reasonId, deletedAt: null },
    });
    if (!reason) throw new ApiError('Reason not found', 404);

    if (tripId) {
      const trip = await prisma.trip.findUnique({
        where: { id: tripId, deletedAt: null },
      });
      if (!trip) throw new ApiError('Trip not found', 404);
    }
  }
}

const issueService = new IssueService();
export default issueService;
