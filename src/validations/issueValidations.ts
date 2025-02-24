import Joi from 'joi';
import { CreateIssue, UpdateIssue, IssyeTypeQuery } from '../types/issueType';

export const createIssueValidation = Joi.object<CreateIssue>().keys({
  note: Joi.string().optional(),
  reasonId: Joi.number().strict().required(),
  tripId: Joi.number().strict().required(),
});

export const updateIssueValidation = Joi.object<UpdateIssue>().keys({
  note: Joi.string().optional(),
  reasonId: Joi.number().strict().optional(),
});

export const issueTypeQueryValidation = Joi.object<IssyeTypeQuery>().keys({
  page: Joi.number().optional(),
  limit: Joi.number().optional(),
  tripId: Joi.number().optional(),
  reasonId: Joi.number().optional(),
  userId: Joi.number().optional(),
});
