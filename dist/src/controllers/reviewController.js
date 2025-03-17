"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const reviewService_1 = __importDefault(require("../services/reviewService"));
const response_1 = __importDefault(require("../utils/response"));
class ReviewController {
    async createDriverReview(req, res, next) {
        try {
            const reviewer_id = req.user;
            const review = await reviewService_1.default.createDriverReview({
                ...req.body,
                reviewer_id,
            });
            (0, response_1.default)(res, 201, {
                status: true,
                message: 'Review created successfully',
                result: review,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async createPassengerReview(req, res, next) {
        try {
            const reviewer_id = req.user;
            const review = await reviewService_1.default.createPassengerReview({
                ...req.body,
                reviewer_id,
            });
            (0, response_1.default)(res, 201, {
                status: true,
                message: 'Review created successfully',
                result: review,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getOne(req, res, next) {
        try {
            const review = await reviewService_1.default.getOne(+req.params.id);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Review retrieved successfully',
                result: review,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getAll(req, res, next) {
        try {
            const { role } = req;
            const reviews = await reviewService_1.default.getAll(req.query, role);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Reviews retrieved successfully',
                pagination: reviews.pagination,
                result: reviews.data,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getMyReviews(req, res, next) {
        try {
            const { user, role } = req;
            const reviews = await reviewService_1.default.getAll(req.query, role, user);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Reviews retrieved successfully',
                pagination: reviews.pagination,
                result: reviews.data,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getReviewsByTargetId(req, res, next) {
        try {
            const { role } = req;
            const reviews = await reviewService_1.default.getAll(req.query, role, +req.params.target_id);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Reviews retrieved successfully',
                pagination: reviews.pagination,
                result: reviews.data,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
const reviewController = new ReviewController();
exports.default = reviewController;
