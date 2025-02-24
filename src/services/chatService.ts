import prisma from '../../prisma/client';
import { Roles } from '../enum/roles';
import { TripStatus } from '../enum/trip';
import IChatService from '../interfaces/chatService';
import IChat, { ChatQuery, CreateChat } from '../types/chatType';
import { PaginateType } from '../types/paginateType';
import ApiError from '../utils/ApiError';
import { paginate } from '../utils/pagination';

class ChatService implements IChatService {
  async openChat(data: CreateChat): Promise<IChat> {
    const chat = await prisma.chat.findUnique({
      where: {
        userId_driverId_tripId: {
          userId: data.userId,
          driverId: data.driverId,
          tripId: data.tripId,
        },
      },
    });
    if (chat) return chat;
    await this.validateOpenChatMethod(data);
    return prisma.chat.create({
      data,
    });
  }

  async getAll(
    query: ChatQuery,
    role: string,
    userId: number,
  ): Promise<PaginateType<IChat & { _count: { Messages: number } }>> {
    return paginate(
      'chat',
      {
        where: {
          [`${role.toLowerCase()}Id`]: userId, // Get chats based on the role
        },
        include: {
          [role === Roles.DRIVER ? 'User' : 'Driver']: {
            // Include the user or driver based on the role
            select: {
              id: true,
              name: true,
              avatar: true,
              phone: true,
            },
          },
          Messages: {
            take: 1,
            orderBy: { createdAt: 'desc' },
          },
          _count: {
            // Count the number of unread messages
            select: {
              Messages: {
                where: {
                  is_read: false,
                  senderId: { not: userId },
                },
              },
            },
          },
        },
      },
      query.page,
      query.limit,
    );
  }

  private async validateOpenChatMethod(data: CreateChat) {
    const trip = await prisma.trip.findUnique({
      where: { id: data.tripId },
    });
    if (!trip) throw new ApiError('Trip not found', 404);
    if (trip.status === TripStatus.COMPLETED)
      throw new ApiError('Trip is completed', 400);
    if (trip.status === TripStatus.CANCELLED)
      throw new ApiError('Trip is cancelled', 400);
    if (trip.driver_id !== data.driverId)
      throw new ApiError('Driver not assigned to trip', 400);
    const users = await prisma.user.count({
      where: {
        id: { in: [data.driverId, data.userId] },
      },
    });
    if (users !== 2) throw new ApiError('Driver or user not found', 404);
  }
}

const chatService = new ChatService();
export default chatService;
