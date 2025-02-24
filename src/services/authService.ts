import bcrypt from 'bcrypt';
import prisma from '../../prisma/client';
import {
  ChangePasswordType,
  LoginType,
  ResetPasswordType,
  SignUpType,
  VerifyResetCodeType,
} from '../types/authType';
import ApiError from '../utils/ApiError';
import { generateTokens } from '../utils/signToken';
import MsegatService from './msegatService';

class AuthService {
  async checkUserExist(
    field: 'phone' | 'email' | 'national_id',
    value: string,
  ) {
    const user = await prisma.user.findFirst({
      where: {
        [field]: value,
      },
    });
    return !!user;
  }

  async signUp(data: SignUpType) {
    const { password, cityId } = data;
    const checkPhoneExist = await this.checkUserExist('phone', data.phone);
    if (checkPhoneExist) {
      throw new ApiError('Phone already exists', 400);
    }
    const checkEmailExist = await this.checkUserExist('email', data.email);
    if (checkEmailExist) {
      throw new ApiError('Email already exists', 400);
    }
    if (data.national_id) {
      const checkNationalIdExist = await this.checkUserExist(
        'national_id',
        data.national_id,
      );
      if (checkNationalIdExist) {
        throw new ApiError('National ID already exists', 400);
      }
    }
    const user = await prisma.user.create({
      data: {
        ...data,
        cityId: cityId ? +cityId : undefined,
        password: await bcrypt.hash(password, 10),
      },
    });
    const { accessToken, refreshToken } = generateTokens(user);
    const { password: removedPassowrd, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, accessToken, refreshToken };
  }

  async login(data: LoginType) {
    const { phone, password } = data;
    const user = await prisma.user.findUnique({
      where: {
        phone,
      },
      include: {
        City: true,
        Vehicles: {
          where: {
            deletedAt: null,
          },
          take: 1,
        },
      },
    });
    if (!user) {
      throw new ApiError('Phone or password is incorrect', 400);
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new ApiError('Phone or password is incorrect', 400);
    }
    if (user.is_blocked === true || user.deletedAt) {
      throw new ApiError(
        'Your account is either blocked or deleted. If you believe this is a mistake, please contact our support team for assistance.',
        403,
      );
    }

    const { password: removedPassowrd, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async forgetPassword(phone: string) {
    const user = await prisma.user.findUnique({
      where: {
        phone,
      },
    });
    if (!user) {
      throw new ApiError('User not found', 404);
    }
    const otp = await MsegatService.sendOTP(phone, user.prefered_language);

    if (otp.code === 1) {
      await prisma.user_Code.upsert({
        where: {
          userId: user.id,
        },
        update: {
          reset_password_code: otp.id.toString(),
          reset_password_expire_date: new Date(Date.now() + 10 * 60 * 1000),
        },
        create: {
          userId: user.id,
          reset_password_code: otp.id.toString(),
          reset_password_expire_date: new Date(Date.now() + 10 * 60 * 1000),
        },
      });
    }
  }

  async verifyResetPasswordCode(data: VerifyResetCodeType) {
    const { phone, code } = data;
    const userCode = await prisma.user_Code.findFirst({
      where: {
        reset_password_expire_date: {
          gte: new Date(),
        },
        User: {
          phone,
        },
      },
      select: {
        reset_password_code: true,
        User: {
          select: {
            phone: true,
            prefered_language: true,
          },
        },
      },
    });
    if (!userCode) {
      throw new ApiError('Code is Invalid Or Expired', 400);
    }
    const verifyOTP = await MsegatService.verifyOTP({
      lang: userCode.User.prefered_language,
      code,
      id: userCode.reset_password_code!,
    });
    if (verifyOTP.code !== 1) {
      throw new ApiError('Code is Invalid Or Expired', 400);
    }
  }

  async resetPassword(data: ResetPasswordType) {
    const { phone, password } = data;
    const userCode = await prisma.user_Code.findFirst({
      where: {
        reset_password_expire_date: {
          gte: new Date(),
        },
        User: {
          phone,
        },
      },
    });
    if (!userCode) {
      throw new ApiError('Code is Expired', 400);
    }
    await prisma.user.update({
      where: {
        phone,
      },
      data: {
        password: await bcrypt.hash(password, 10),
      },
    });
  }

  async changePassword(userId: number, passwords: ChangePasswordType) {
    const { oldPassword, newPassword } = passwords;
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new ApiError('User not found', 404);
    }
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      throw new ApiError('Old password is incorrect', 400);
    }
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: await bcrypt.hash(newPassword, 10),
      },
    });
  }

  async sendVerificationCode(userId: number): Promise<void> {
    const user = await prisma.user.findFirst({
      where: { id: userId, phone_verified: false },
    });
    if (!user) {
      throw new ApiError('User not found', 404);
    }
    const otp = await MsegatService.sendOTP(user.phone, user.prefered_language);
    if (otp.code === 1) {
      await prisma.user_Code.upsert({
        where: {
          userId: user.id,
        },
        update: {
          phone_verify_code: otp.id.toString(),
          phone_expire_date: new Date(Date.now() + 10 * 60 * 1000),
        },
        create: {
          userId: user.id,
          phone_verify_code: otp.id.toString(),
          phone_expire_date: new Date(Date.now() + 10 * 60 * 1000),
        },
      });
    }
  }

  async verifyPhoneCode(userId: number, code: string): Promise<void> {
    const userCode = await prisma.user_Code.findFirst({
      where: {
        phone_expire_date: {
          gte: new Date(),
        },
        userId,
      },
      include: {
        User: {
          select: {
            prefered_language: true,
          },
        },
      },
    });
    if (!userCode) {
      throw new ApiError('Code is Invalid Or Expired', 400);
    }

    const verifyOTP = await MsegatService.verifyOTP({
      lang: userCode.User.prefered_language,
      code,
      id: userCode.phone_verify_code!,
    });
    if (verifyOTP.code !== 1) {
      throw new ApiError('Code is Invalid Or Expired', 400);
    }

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        phone_verified: true,
      },
    });
  }
}

const authService = new AuthService();
export default authService;
