import Joi from 'joi';
import { CreateComplaint, UpdateComplaint } from '../types/complaint';
import { ComplaintCategory } from '../enum/complaintCategory';

export const createComplaintValidations = Joi.object<CreateComplaint>().keys({
  category: Joi.when('is_complaint', {
    is: true,
    then: Joi.string()
      .valid(...Object.values(ComplaintCategory))
      .required(),
    otherwise: Joi.string()
      .valid(...Object.values(ComplaintCategory))
      .optional(),
  }),
  note: Joi.string().min(10).required(),
  is_complaint: Joi.boolean().optional(),
});

export const updateComplaintValidations = Joi.object<UpdateComplaint>().keys({
  category: Joi.string()
    .valid(...Object.values(ComplaintCategory))
    .optional(),
  note: Joi.string().min(10).optional(),
  is_complaint: Joi.boolean().optional(),
});
