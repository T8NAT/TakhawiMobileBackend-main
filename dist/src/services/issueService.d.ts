import { IIssueService } from '../interfaces/issueService';
import { CreateIssue, UpdateIssue, Issue, IssyeTypeQuery } from '../types/issueType';
import { PaginateType } from '../types/paginateType';
declare class IssueService implements IIssueService {
    create(issue: CreateIssue): Promise<Issue>;
    getOne(id: number): Promise<Issue>;
    getAll(id: number, role: string, queryString: IssyeTypeQuery): Promise<PaginateType<Issue>>;
    update(id: number, issue: UpdateIssue): Promise<Issue>;
    delete(id: number): Promise<void>;
    checkTripAndReasonExist(reasonId: number, tripId?: number): Promise<void>;
}
declare const issueService: IssueService;
export default issueService;
