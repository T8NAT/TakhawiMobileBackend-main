import { QueryType } from './queryType';
import { FCMToken, User } from './userType';

export default interface IMessage {
  id: string;
  content: string;
  contentType: string;
  createdAt: Date;
  chatId: string;
  senderId: number;
  is_read: boolean;

  Sender?: User;
}

export type CreateMessage = Omit<
  IMessage,
  'id' | 'createdAt' | 'Sender' | 'is_read'
>;
export type MessageQuery = Partial<QueryType>;

export type CreateMessageReturnType = IMessage & {
  sockets: string[];
  fcms: FCMToken[];
  reciverId: number;
  usersId: number[];
  language: string;
};
