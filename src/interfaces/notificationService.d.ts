import {
  CreateNotification,
  Notification,
  NotificationQueryType,
} from '../types/notificationType';
import { PaginateType } from '../types/paginateType';

export interface INotificationService {
  create(data: CreateNotification): Promise<Notification>;
  getAll(
    queryString: NotificationQueryType,
    userId: number,
  ): Promise<PaginateType<Notification>>;
  markAsRead(id: number, userId: number): Promise<void>;
  markAllAsRead(userId: number): Promise<void>;
  delete(id: number, userId: number): Promise<void>;
}
