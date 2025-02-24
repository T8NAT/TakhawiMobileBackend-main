import Joi from 'joi';
import { CreateReview, ReviewQueryType } from '../types/reviewType';
import { Roles } from '../enum/roles';

export const createReviewValidation = Joi.object<CreateReview>().keys({
  trip_id: Joi.number().strict().required(),
  target_id: Joi.number().strict().required(),
  rate: Joi.number().min(1).max(5).required(),
  note: Joi.string().optional(),
});

export const reviewTypeQueryValidation = Joi.object<ReviewQueryType>().keys({
  page: Joi.number().min(1).optional(),
  limit: Joi.number().min(1).optional(),
  target_id: Joi.number().optional(),
  type: Joi.string().valid(Roles.DRIVER, Roles.USER).optional(),
  trip_id: Joi.number().optional(),
});
