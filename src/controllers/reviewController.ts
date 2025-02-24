import { Request, Response, NextFunction } from 'express';
import reviewService from '../services/reviewService';
import response from '../utils/response';
import CustomRequest from '../interfaces/customRequest';

class ReviewController {
  async createDriverReview(req: Request, res: Response, next: NextFunction) {
    try {
      const reviewer_id = (req as CustomRequest).user;

      const review = await reviewService.createDriverReview({
        ...req.body,
        reviewer_id,
      });
      response(res, 201, {
        status: true,
        message: 'Review created successfully',
        result: review,
      });
    } catch (error) {
      next(error);
    }
  }

  async createPassengerReview(req: Request, res: Response, next: NextFunction) {
    try {
      const reviewer_id = (req as CustomRequest).user;

      const review = await reviewService.createPassengerReview({
        ...req.body,
        reviewer_id,
      });
      response(res, 201, {
        status: true,
        message: 'Review created successfully',
        result: review,
      });
    } catch (error) {
      next(error);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const review = await reviewService.getOne(+req.params.id);
      response(res, 200, {
        status: true,
        message: 'Review retrieved successfully',
        result: review,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { role } = req as CustomRequest;
      const reviews = await reviewService.getAll(req.query, role);
      response(res, 200, {
        status: true,
        message: 'Reviews retrieved successfully',
        pagination: reviews.pagination,
        result: reviews.data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, role } = req as CustomRequest;
      const reviews = await reviewService.getAll(req.query, role, user);
      response(res, 200, {
        status: true,
        message: 'Reviews retrieved successfully',
        pagination: reviews.pagination,
        result: reviews.data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getReviewsByTargetId(req: Request, res: Response, next: NextFunction) {
    try {
      const { role } = req as CustomRequest;
      const reviews = await reviewService.getAll(
        req.query,
        role,
        +req.params.target_id,
      );
      response(res, 200, {
        status: true,
        message: 'Reviews retrieved successfully',
        pagination: reviews.pagination,
        result: reviews.data,
      });
    } catch (error) {
      next(error);
    }
  }
}

const reviewController = new ReviewController();
export default reviewController;
