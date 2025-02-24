import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import response from '../utils/response';
import ApiError from '../utils/ApiError';

function joiMiddleWare(
  schema: Joi.ObjectSchema<any>,
  location: 'body' | 'query' = 'body',
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error } = schema.validate(req[location], {
        abortEarly: true,
      });

      if (error) {
        const validationErrors = error.details.map(
          (detail: any) => detail.message,
        );
        return response(res, 400, {
          status: false,
          message: validationErrors[0],
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}
export function joiAsyncMiddleWare(
  schema: Joi.ObjectSchema<any>,
  location: 'body' | 'query' = 'body',
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validateAsync(req[location]);
      next();
    } catch (error: any) {
      next(new ApiError(error.message, 400));
    }
  };
}
export default joiMiddleWare;
