import Joi from 'joi';

export const pdfReportValidations = Joi.object().keys({
  type: Joi.string().valid('download', 'preview').optional(),
});
