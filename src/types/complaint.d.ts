import { QueryType } from './queryType';

export interface Complaint {
  id: number;
  category: string | null;
  note: string;
  is_complaint: boolean;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateComplaint = Omit<Complaint, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateComplaint = Partial<CreateComplaint>;
export type ComplaintQueryType = QueryType & {};
