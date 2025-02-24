import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import ApiError from '../utils/ApiError';
import prisma from '../../prisma/client';
import CustomRequest from '../interfaces/customRequest';
import { Roles } from '../enum/roles';
import { Location } from '../types/userType';

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token;
    if (req.headers.authorization) {
      token = req.headers.authorization.replace('Bearer ', '');
    }
    if (!token) {
      return next(new ApiError('No Token Provided', 401));
    }
    const decoded: any = jwt.verify(token, process.env.SECRET_KEY_ACCESSTOKEN!);
    const user = await prisma.user.findUnique({
      where: {
        uuid: decoded.id,
      },
      select: {
        id: true,
        uuid: true,
        role: true,
        is_blocked: true,
        deletedAt: true,
        gender: true,
        location: true,
      },
    });
    if (!user) {
      return next(new ApiError('Unauthorized', 401));
    }
    if (user.is_blocked) {
      return next(new ApiError('Blocked', 403));
    }
    if (user.deletedAt) {
      return next(new ApiError('Deleted Account', 401));
    }
    (req as CustomRequest).user = user.id;
    (req as CustomRequest).role = decoded.role;
    (req as CustomRequest).gender = user.gender;
    (req as CustomRequest).temp_id = user.uuid;
    (req as CustomRequest).lat = (user.location as Location).lat;
    (req as CustomRequest).lng = (user.location as Location).lng;
    // That means if some one is user have a token with admin role and he is not an admin then we will change his role to his default role
    if (
      ![Roles.USER, Roles.DRIVER].includes(decoded.role) &&
      decoded.role !== user.role
    ) {
      (req as CustomRequest).role = user.role;
    }

    next();
  } catch (error) {
    next(new ApiError('Invalid Token', 401));
  }
};
