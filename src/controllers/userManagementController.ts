import { Request, Response, NextFunction } from 'express';
import response from '../utils/response';
import CustomRequest from '../interfaces/customRequest';
import userManagementService from '../services/userManagementService';
import { Roles } from '../enum/roles';
import userService from '../services/userService';
import tripService from '../services/tripService';
import { serializeUser } from '../utils/serialization/user.serialization';
import { serializeActiveTrip } from '../utils/serialization/activeTrip.serialization';
import { User } from '../types/userType';

class UserManagementController {
  async updateLocation(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as CustomRequest).user;
      await userManagementService.updateLocation(userId, req.body);
      response(res, 200, {
        status: true,
        message: 'Location updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async updateDriverStatus(req: Request, res: Response, next: NextFunction) {
    try {
      await userManagementService.updateUserStatus(
        +req.params.id,
        Roles.DRIVER,
        req.body.status,
      );
      response(res, 200, {
        status: true,
        message: 'Driver status updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async updatePassengerStatus(req: Request, res: Response, next: NextFunction) {
    try {
      await userManagementService.updateUserStatus(
        +req.params.id,
        Roles.USER,
        req.body.status,
      );
      response(res, 200, {
        status: true,
        message: 'Passenger status updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async createFCMToken(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as CustomRequest).user;
      await userManagementService.createFCMToken(userId, req.body.token);
      response(res, 201, {
        status: true,
        message: 'FCM token created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async switchToDriver(req: Request, res: Response, next: NextFunction) {
    try {
      let token;
      if (req.headers.authorization) {
        token = req.headers.authorization.replace('Bearer ', '');
      }
      const { user: userId, language } = req as CustomRequest;
      const [user, activeTrip] = await Promise.all([
        userService.getProfile(userId),
        tripService.getActiveTrip(userId, Roles.DRIVER),
      ]);
      const tokens = userManagementService.switchToDriver(token, user as User);
      response(res, 200, {
        status: true,
        message: 'Switched to driver successfully',
        result: {
          ...tokens,
          ...serializeUser(user, language, Roles.DRIVER),
          role: Roles.DRIVER,
          activeTrip: activeTrip
            ? serializeActiveTrip(activeTrip, language, Roles.DRIVER)
            : null,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async switchToUser(req: Request, res: Response, next: NextFunction) {
    try {
      let token;
      if (req.headers.authorization) {
        token = req.headers.authorization.replace('Bearer ', '');
      }
      const { user: userId, language } = req as CustomRequest;
      const tokens = userManagementService.switchToUser(token);
      const [user, activeTrip] = await Promise.all([
        userService.getProfile(userId),
        tripService.getActiveTrip(userId, Roles.USER),
      ]);
      response(res, 200, {
        status: true,
        message: 'Switched to user successfully',
        result: {
          ...tokens,
          ...serializeUser(user, language, Roles.USER),
          role: Roles.USER,
          activeTrip: activeTrip
            ? serializeActiveTrip(activeTrip, language, Roles.USER)
            : null,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

const userManagementController = new UserManagementController();
export default userManagementController;
