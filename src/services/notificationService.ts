import prisma from '../../prisma/client';
import { INotificationService } from '../interfaces/notificationService';
import { SendNotificationType } from '../types/notificationTokenType';
import {
  CreateNotification,
  Notification,
  NotificationQueryType,
} from '../types/notificationType';
import { PaginateType } from '../types/paginateType';
import { paginate } from '../utils/pagination';
import sendPushNotification from '../utils/pushNotification';

class NotificationService implements INotificationService {
  async create(data: CreateNotification): Promise<Notification> {
    return prisma.notification.create({ data });
  }

  async getAll(
    queryString: NotificationQueryType,
    userId: number,
  ): Promise<PaginateType<Notification>> {
    return paginate(
      'notification',
      {
        where: {
          userId,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      queryString.page,
      queryString.limit,
    );
  }

  async markAsRead(id: number, userId: number): Promise<void> {
    await prisma.notification.update({
      where: {
        id,
        userId,
      },
      data: {
        is_read: true,
      },
    });
  }

  async markAllAsRead(userId: number): Promise<void> {
    await prisma.notification.updateMany({
      where: {
        userId,
      },
      data: {
        is_read: true,
      },
    });
  }

  async delete(id: number, userId: number): Promise<void> {
    await prisma.notification.delete({
      where: {
        id,
        userId,
      },
    });
  }

  async sendNotification(data: SendNotificationType): Promise<void> {
    const usertokens = data.userIds
      ? await prisma.user_FCM_Token.findMany({
          where: { userId: { in: data.userIds } },
        })
      : await prisma.user_FCM_Token.findMany();

    if (usertokens.length > 0) {
      data.tokens = usertokens.map((token) => token.token);
      await sendPushNotification(data);
    }
  }
}

const notificationService = new NotificationService();
export default notificationService;
