import Joi from "joi";
import { CreateReview, ReviewQueryType } from "../types/reviewType";
export declare const createReviewValidation: Joi.ObjectSchema<CreateReview>;
export declare const reviewTypeQueryValidation: Joi.ObjectSchema<ReviewQueryType>;
