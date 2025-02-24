import { Request, Response, NextFunction } from 'express';
import response from '../utils/response';
import userService from '../services/userService';
import CustomRequest from '../interfaces/customRequest';
import { removeFile } from '../utils/fileHandler';
import { serializeUser } from '../utils/serialization/user.serialization';
import tripService from '../services/tripService';
import { serializeActiveTrip } from '../utils/serialization/activeTrip.serialization';

class UserContorller {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.file) {
        req.body.avatar = req.file.path;
      }
      const user = await userService.create(req.body);
      response(res, 201, {
        status: true,
        message: 'User created successfully',
        result: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.getAll(req.query);
      response(res, 200, {
        status: true,
        message: 'Users fetched successfully',
        pagination: users.pagination,
        result: users.data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getDrivers(req: Request, res: Response, next: NextFunction) {
    try {
      const drivers = await userService.getDrivers(req.query);
      response(res, 200, {
        status: true,
        message: 'Drivers fetched successfully',
        result: drivers,
      });
    } catch (error) {
      next(error);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.getOne(+req.params.id);
      response(res, 200, {
        status: true,
        message: 'User fetched successfully',
        result: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { user: userId, language, role } = req as CustomRequest;
      const [user, activeTrip] = await Promise.all([
        userService.getProfile(userId),
        tripService.getActiveTrip(userId, role),
      ]);
      response(res, 200, {
        status: true,
        message: 'User fetched successfully',
        result: {
          ...serializeUser(user, language, role),
          role,
          activeTrip: activeTrip
            ? serializeActiveTrip(activeTrip, language, role)
            : null,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as CustomRequest).user;
      const existedUser = await userService.getProfile(userId);
      if (req.file) {
        req.body.avatar = req.file.path;
      }
      const user = await userService.updateProfile(userId, req.body);
      if (req.file && existedUser.avatar) {
        removeFile(existedUser.avatar);
      }
      response(res, 200, {
        status: true,
        message: 'User updated successfully',
        result: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as CustomRequest).user;
      await userService.deleteProfile(userId);
      response(res, 204, {
        status: true,
        message: 'User deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

const userController = new UserContorller();
export default userController;
