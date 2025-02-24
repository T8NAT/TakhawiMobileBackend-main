import jwt from 'jsonwebtoken';
import prisma from '../../prisma/client';
import { Roles } from '../enum/roles';
import { TransactionType } from '../enum/wallet';
import { IUserManagementService } from '../interfaces/userManagementService';
import { Location, User } from '../types/userType';
import ApiError from '../utils/ApiError';
import { generateTokens } from '../utils/signToken';

class UserManagementService implements IUserManagementService {
  async updateLocation(id: number, location: Location): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { location },
    });
  }

  async updateUserStatus(
    id: number,
    role: string,
    status: string,
  ): Promise<void> {
    const user = await prisma.user.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    });
    if (!user) {
      throw new ApiError('User not found', 404);
    }

    await prisma.user.update({
      where: { id },
      data:
        role === Roles.DRIVER
          ? { driver_status: status }
          : { passenger_status: status },
    });
  }

  async createFCMToken(userId: number, token: string): Promise<void> {
    await prisma.user_FCM_Token.upsert({
      where: {
        token,
      },
      create: {
        token,
        userId,
      },
      update: {},
    });
  }

  async checkBalanceAndUpdateWallet(
    user: User,
    amount: number,
    trip_id: number,
  ): Promise<void> {
    if (user.user_wallet_balance < amount) {
      throw new ApiError('Insufficient balance', 400);
    } else {
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          user_wallet_balance: {
            decrement: amount,
          },
          Passenger_Wallet_Transaction: {
            create: {
              amount,
              current_balance: user.user_wallet_balance - amount,
              previous_balance: user.user_wallet_balance,
              transaction_type: TransactionType.BOOK_TRIP,
              trip_id,
            },
          },
        },
      });
    }
  }

  async switchToDriver(token?: string, user?: User) {
    if (!token) {
      throw new ApiError('No Token Provided', 401);
    }
    const decoded: any = jwt.verify(token, process.env.SECRET_KEY_ACCESSTOKEN!);
    const tokens = generateTokens({
      uuid: decoded.id,
      role: Roles.DRIVER,
    });
    if (user!.switch_to_driver === false) {
      await prisma.user.update({
        where: { id: user!.id },
        data: { switch_to_driver: true },
      });
    }
    return tokens;
  }

  switchToUser(token?: string) {
    if (!token) {
      throw new ApiError('No Token Provided', 401);
    }
    const decoded: any = jwt.verify(token, process.env.SECRET_KEY_ACCESSTOKEN!);
    const tokens = generateTokens({
      uuid: decoded.id,
      role: Roles.USER,
    });
    return tokens;
  }
}

const userManagementService = new UserManagementService();
export default userManagementService;
