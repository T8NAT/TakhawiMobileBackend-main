import { NextFunction, Request, Response } from 'express';
import authService from '../services/authService';
import response from '../utils/response';
import CustomRequest from '../interfaces/customRequest';
import tripService from '../services/tripService';
import { serializeActiveTrip } from '../utils/serialization/activeTrip.serialization';
import { generateTokens } from '../utils/signToken';
import { Roles } from '../enum/roles';
import { customEventEmitter } from '../utils/event-listner';

class AuthController {
  async checkPhoneExist(req: Request, res: Response, next: NextFunction) {
    try {
      const exist = await authService.checkUserExist('phone', req.body.phone);
      const message = exist ? 'Phone exist' : 'Phone does not exist';
      response(res, 200, { status: true, message, result: exist });
    } catch (error) {
      next(error);
    }
  }

  async checkEmailExist(req: Request, res: Response, next: NextFunction) {
    try {
      const exist = await authService.checkUserExist('email', req.body.email);
      const message = exist ? 'Email exist' : 'Email does not exist';
      response(res, 200, { status: true, message, result: exist });
    } catch (error) {
      next(error);
    }
  }

  async signUpUser(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.file) {
        req.body.avatar = req.file.path;
      }
      const user = await authService.signUp(req.body);
      response(res, 201, {
        status: true,
        message: 'Account created successfully!',
        result: user,
      });
      customEventEmitter.emit('user-signup', user);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.login(req.body);
      const tokens = generateTokens(user);
      response(res, 200, {
        status: true,
        message: 'Login successful!',
        result: {
          ...tokens,
          user,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async loginFromMobile(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.login(req.body);
      const role = user.role === Roles.DRIVER ? Roles.DRIVER : Roles.USER;
      const activeTrip = await tripService.getActiveTrip(user.id, role);

      const tokens = generateTokens({
        ...user,
        role,
      });
      response(res, 200, {
        status: true,
        message: 'Login successful!',
        result: {
          ...tokens,
          user: {
            ...user,
            role,
          },
          activeTrip: activeTrip
            ? serializeActiveTrip(
                activeTrip,
                user.prefered_language as any,
                role,
              )
            : null,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // async addUsers(req: Request, res: Response, next: NextFunction){
  //     try {
  //         const user = await authService.signUp(req.body, req.body.role);
  //         response(res, 201, {status: true, message: "User created successfully!", data: user });
  //     } catch (error) {
  //         next(error);
  //     }
  // }

  async forgetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.forgetPassword(req.body.phone);
      // const html = pug.renderFile(`${process.cwd()}/src/templates/forgetPassword.pug`, {code: user.code, username: user.username})
      // sendMail({to: user.email, html, subject: "Reset Password"})
      response(res, 200, {
        status: true,
        message: 'Reset Code Sent Successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async verifyResetCode(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.verifyResetPasswordCode(req.body);
      response(res, 200, {
        status: true,
        message: 'Code Verified Successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.resetPassword(req.body);
      response(res, 200, {
        status: true,
        message: 'Password reset successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as CustomRequest).user;
      await authService.changePassword(userId, req.body);
      response(res, 200, {
        status: true,
        message: 'Password changed successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async sendVerificationCode(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req as CustomRequest;
      await authService.sendVerificationCode(user);
      response(res, 200, {
        status: true,
        message: 'Verification Code Sent Successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async verifyPhoneCode(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req as CustomRequest;
      await authService.verifyPhoneCode(user, req.body.code);
      response(res, 200, {
        status: true,
        message: 'Phone Verified Successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
const authController = new AuthController();
export default authController;
