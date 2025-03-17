import { IReviewService } from '../interfaces/reviewService';
import { PaginateType } from '../types/paginateType';
import { CreateReview, ReviewQueryType, Review } from '../types/reviewType';
export declare class ReviewService implements IReviewService {
    createDriverReview(data: CreateReview): Promise<Review>;
    createPassengerReview(data: CreateReview): Promise<Review>;
    getOne(id: number): Promise<Review>;
    getAll(queryString: ReviewQueryType, role: string, userId?: number): Promise<PaginateType<Review>>;
    private reviewExists;
    private calculateAverageRating;
}
declare const reviewService: ReviewService;
export default reviewService;
