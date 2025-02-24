import prisma from '../../prisma/client';
import IMessageService from '../interfaces/messageService';
import IMessage, {
  CreateMessage,
  CreateMessageReturnType,
  MessageQuery,
} from '../types/messageType';
import { PaginateType } from '../types/paginateType';
import ApiError from '../utils/ApiError';
import { paginate } from '../utils/pagination';

class MessageService implements IMessageService {
  async sendMessage(data: CreateMessage): Promise<CreateMessageReturnType> {
    const chat = await prisma.chat.findUnique({
      where: { id: data.chatId },
      include: {
        ChatRoom: {
          select: {
            socketId: true,
            userId: true,
          },
        },
        User: {
          select: {
            User_FCM_Tokens: true,
            prefered_language: true,
          },
        },
        Driver: {
          select: {
            User_FCM_Tokens: true,
            prefered_language: true,
          },
        },
      },
    });
    if (!chat) throw new ApiError('Chat not found', 404);
    if (!chat.is_active) throw new ApiError('Chat is closed', 400);
    if (chat.driverId !== data.senderId && chat.userId !== data.senderId) {
      throw new ApiError(
        'You are not allowed to send message in this chat',
        400,
      );
    }

    const message = await prisma.message.create({
      data,
    });
    const usersId: number[] = [];
    return {
      ...message,
      sockets: chat.ChatRoom.map((room) => {
        usersId.push(room.userId);
        return room.socketId;
      }),
      fcms:
        message.senderId === chat.userId
          ? chat.Driver.User_FCM_Tokens
          : chat.User.User_FCM_Tokens,
      usersId,
      reciverId: message.senderId === chat.userId ? chat.driverId : chat.userId,
      language:
        message.senderId === chat.userId
          ? chat.Driver.prefered_language
          : chat.User.prefered_language,
    };
  }

  async getAll(
    query: MessageQuery,
    chatId: string,
  ): Promise<PaginateType<IMessage>> {
    return paginate(
      'message',
      { where: { chatId }, orderBy: { createdAt: 'desc' } },
      query.page,
      query.limit,
    );
  }

  async markAllAsRead(chatId: string, userId: number): Promise<boolean> {
    await prisma.message.updateMany({
      where: { chatId, senderId: { not: userId } },
      data: { is_read: true },
    });
    return true;
  }
}

const messageService = new MessageService();
export default messageService;
