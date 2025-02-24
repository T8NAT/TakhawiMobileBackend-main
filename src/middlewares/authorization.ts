import { Request, Response, NextFunction } from 'express';
import CustomRequest from '../interfaces/customRequest';
import ApiError from '../utils/ApiError';

export default (...roles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes((req as CustomRequest).role)) {
      return next(
        new ApiError('You do not have permission to perform this action', 403),
      );
    }
    next();
  };
