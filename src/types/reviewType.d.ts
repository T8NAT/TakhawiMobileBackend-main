import { QueryType } from './queryType';

export interface Review {
  id: number;
  rate: number;
  note: string | null;
  type: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  reviewer_id: number;
  target_id: number;
  trip_id: number;
}

export type CreateReview = Omit<Review, 'id' | 'createdAt' | 'updatedAt'>;
export type ReviewQueryType = QueryType & {
  target_id?: number;
  type?: string;
  trip_id?: number;
};
