import IMessage, {
  CreateMessage,
  CreateMessageReturnType,
  MessageQuery,
} from '../types/messageType';
import { PaginateType } from '../types/paginateType';

export default interface IMessageService {
  sendMessage(message: CreateMessage): Promise<CreateMessageReturnType>;
  getAll(query: MessageQuery, chatId: string): Promise<PaginateType<IMessage>>;
  markAllAsRead(chatId: string, userId: number): Promise<boolean>;
}
