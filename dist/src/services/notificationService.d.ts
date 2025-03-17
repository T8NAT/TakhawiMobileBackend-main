import { INotificationService } from '../interfaces/notificationService';
import { SendNotificationType } from '../types/notificationTokenType';
import { CreateNotification, Notification, NotificationQueryType } from '../types/notificationType';
import { PaginateType } from '../types/paginateType';
declare class NotificationService implements INotificationService {
    create(data: CreateNotification): Promise<Notification>;
    getAll(queryString: NotificationQueryType, userId: number): Promise<PaginateType<Notification>>;
    markAsRead(id: number, userId: number): Promise<void>;
    markAllAsRead(userId: number): Promise<void>;
    delete(id: number, userId: number): Promise<void>;
    sendNotification(data: SendNotificationType): Promise<void>;
}
declare const notificationService: NotificationService;
export default notificationService;
