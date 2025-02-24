import { QueryType } from './queryType';

export interface Issue {
  id: number;
  note: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  userId: number;
  tripId: number;
  reasonId: number;
}

export type CreateIssue = Omit<
  Issue,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;
export type UpdateIssue = Partial<Omit<CreateIssue, 'tripId' | 'userId'>>;
export type IssyeTypeQuery = QueryType & {
  tripId?: number;
  userId?: number;
  reasonId?: number;
};
