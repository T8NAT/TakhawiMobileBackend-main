import { User } from './userType';
import { QueryType } from './queryType';

export interface Notification {
  id: number;
  ar_title: string;
  ar_body: string;
  en_title: string;
  en_body: string;
  type: string;
  is_read: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  User?: User;
}

export type CreateNotification = Omit<
  Notification,
  'id' | 'createdAt' | 'updatedAt' | 'User' | 'is_read'
>;
export type CreateManyNotifications = Omit<CreateNotification, 'userId'>;
export type NotificationQueryType = QueryType & {};
