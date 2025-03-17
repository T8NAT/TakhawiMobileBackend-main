import { Request, Response, NextFunction } from 'express';
declare class ReviewController {
    createDriverReview(req: Request, res: Response, next: NextFunction): Promise<void>;
    createPassengerReview(req: Request, res: Response, next: NextFunction): Promise<void>;
    getOne(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAll(req: Request, res: Response, next: NextFunction): Promise<void>;
    getMyReviews(req: Request, res: Response, next: NextFunction): Promise<void>;
    getReviewsByTargetId(req: Request, res: Response, next: NextFunction): Promise<void>;
}
declare const reviewController: ReviewController;
export default reviewController;
