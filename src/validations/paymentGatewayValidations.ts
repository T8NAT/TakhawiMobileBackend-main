import Joi from 'joi';

export const applepaySessionValidation = Joi.object().keys({
  type: Joi.string().valid('offer', 'basic-trip').required(),
  checkoutId: Joi.string().required(),
});
