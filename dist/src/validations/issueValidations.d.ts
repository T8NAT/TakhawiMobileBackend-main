import Joi from 'joi';
import { CreateIssue, IssyeTypeQuery } from '../types/issueType';
export declare const createIssueValidation: Joi.ObjectSchema<CreateIssue>;
export declare const updateIssueValidation: Joi.ObjectSchema<Partial<Omit<CreateIssue, "userId" | "tripId">>>;
export declare const issueTypeQueryValidation: Joi.ObjectSchema<IssyeTypeQuery>;
