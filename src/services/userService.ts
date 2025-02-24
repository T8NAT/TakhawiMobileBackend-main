import bcrypt from 'bcrypt';
import prisma from '../../prisma/client';
import { IUserService } from '../interfaces/userService';
import { CreateUser, UpdateUser, User, UserQueryType } from '../types/userType';
import ApiError from '../utils/ApiError';
import authService from './authService';
import { PaginateType } from '../types/paginateType';
import { paginate } from '../utils/pagination';
import { UserActivityStatus } from '../enum/userStatus';
import { Roles } from '../enum/roles';

class UserService implements IUserService {
  async create(data: CreateUser): Promise<Partial<User>> {
    const { hobbies, ...rest } = data;
    const checkPhoneExist = await authService.checkUserExist(
      'phone',
      data.phone,
    );
    if (checkPhoneExist) {
      throw new ApiError('Phone already exists', 400);
    }
    const checkEmailExist = await authService.checkUserExist(
      'email',
      data.email,
    );
    if (checkEmailExist) {
      throw new ApiError('Email already exists', 400);
    }

    if (data.national_id) {
      const checkNationalIdExist = await authService.checkUserExist(
        'national_id',
        data.national_id,
      );
      if (checkNationalIdExist) {
        throw new ApiError('National ID already exists', 400);
      }
    }

    const { password, ...user } = await prisma.user.create({
      data: {
        ...rest,
        password: await bcrypt.hash(data.password, 10),
        birth_date: data.birth_date ? new Date(data.birth_date) : undefined,
        cityId: data.cityId ? +data.cityId : undefined,
        Hobbies: data.hobbies
          ? {
              connect: data.hobbies.map((id) => ({ id: +id })),
            }
          : undefined,
      },
    });
    if (data.hobbies) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          profile_complted: { increment: 25 },
        },
      });
    }
    return user;
  }

  async getAll(queryString: UserQueryType): Promise<PaginateType<User>> {
    let userActivityStatus;
    switch (queryString.user_activity_status) {
      case UserActivityStatus.ACTIVE:
        userActivityStatus = null;
        break;
      case UserActivityStatus.DELETED:
        userActivityStatus = { not: null };
        break;
      case UserActivityStatus.ALL:
        userActivityStatus = undefined;
        break;
      default:
        userActivityStatus = null; // default active users
    }

    return paginate(
      'user',
      {
        where: {
          deletedAt: userActivityStatus,
          passenger_status: queryString.passenger_status,
          driver_status: queryString.driver_status,
          wasl_registration_status: queryString.wasl_registration_status,
          role: queryString.role,
        },
        include: {
          User_Documents: true,
        },
      },
      queryString.page,
      queryString.limit,
    );
  }

  async getDrivers(queryString: UserQueryType): Promise<PaginateType<User>> {
    return paginate(
      'user',
      {
        where: {
          OR: [
            {
              role: Roles.DRIVER,
            },
            {
              switch_to_driver: true,
            },
          ],
        },
        include: {
          User_Documents: true,
        },
      },
      queryString.page,
      queryString.limit,
    );
  }

  async getOne(id: number): Promise<Partial<User>> {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        Complaints: true,
        User_Documents: true,
        Vehicles: {
          include: {
            Vehicle_Image: true,
            Vehicle_Licence: true,
            Insurance_Image: true,
            Vehicle_Class: true,
            Vehicle_Color: true,
            Vehicle_Name: true,
            Vehicle_Type: true,
          },
        },
      },
    });
    if (!user) {
      throw new ApiError('User not found', 404);
    }
    return user;
  }

  async getProfile(id: number): Promise<Partial<User>> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        avatar: true,
        name: true,
        email: true,
        phone: true,
        birth_date: true,
        gender: true,
        bio: true,
        prefered_language: true,
        City: true,
        Hobbies: true,
        profile_complted: true,
        driver_rate: true,
        passenger_rate: true,
        role: true,
        driver_status: true,
        passenger_status: true,
        switch_to_driver: true,
        phone_verified: true,
        Vehicles: {
          where: {
            deletedAt: null,
          },
          include: {
            Vehicle_Class: true,
            Vehicle_Color: true,
            Vehicle_Name: true,
            Vehicle_Type: true,
            Vehicle_Licence: true,
          },
          take: 1,
        },
      },
    });
    if (!user) {
      throw new ApiError('User not found', 404);
    }
    return user;
  }

  async updateProfile(id: number, data: UpdateUser): Promise<Partial<User>> {
    const { hobbies, ...rest } = data;
    if (data.national_id) {
      const checkNationalIdExist = await prisma.user.findFirst({
        where: { national_id: data.national_id },
      });
      if (checkNationalIdExist && checkNationalIdExist.id !== id) {
        throw new ApiError('National ID already exists', 400);
      }
    }
    if (data.phone) {
      const checkPhoneExist = await prisma.user.findUnique({
        where: { phone: data.phone },
      });
      if (checkPhoneExist && checkPhoneExist.id !== id) {
        throw new ApiError('Phone already exists', 400);
      }
    }
    if (data.email) {
      const checkEmailExist = await prisma.user.findUnique({
        where: { email: data.email },
      });
      if (checkEmailExist && checkEmailExist.id !== id) {
        throw new ApiError('Email already exists', 400);
      }
    }
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...rest,
        cityId: data.cityId ? +data.cityId : undefined,
        birth_date: data.birth_date ? new Date(data.birth_date) : undefined,
        Hobbies: data.hobbies
          ? {
              set: [],
              connect: data.hobbies.map((id) => ({ id: +id })),
            }
          : undefined,
      },
      select: {
        id: true,
        avatar: true,
        name: true,
        email: true,
        phone: true,
        profile_complted: true,
        birth_date: true,
        gender: true,
        bio: true,
        prefered_language: true,
        City: true,
        Hobbies: true,
      },
    });
    if (data.hobbies && updatedUser.profile_complted < 75) {
      await prisma.user.update({
        where: { id },
        data: {
          profile_complted: { increment: 25 },
        },
      });
    }
    return updatedUser;
  }

  async deleteProfile(id: number): Promise<void> {
    await this.getProfile(id);
    await prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async getUserById(id: number): Promise<User> {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new ApiError('User not found', 404);
    }
    return user;
  }
}

const userService = new UserService();
export default userService;
