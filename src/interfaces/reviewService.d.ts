import { PaginateType } from '../types/paginateType';
import {
  CreateReview,
  UpdateReview,
  Review,
  ReviewQueryType,
} from '../types/reviewType';
export interface IReviewService {
  createDriverReview: (data: CreateReview) => Promise<Review>;
  createPassengerReview: (data: CreateReview) => Promise<Review>;
  getOne: (id: number) => Promise<Review>;
  getAll: (
    queryString: ReviewQueryType,
    role: string,
    userId?: number,
  ) => Promise<PaginateType<Review>>;
}
