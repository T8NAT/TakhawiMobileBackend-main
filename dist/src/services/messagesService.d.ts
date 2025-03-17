import IMessageService from '../interfaces/messageService';
import IMessage, { CreateMessage, CreateMessageReturnType, MessageQuery } from '../types/messageType';
import { PaginateType } from '../types/paginateType';
declare class MessageService implements IMessageService {
    sendMessage(data: CreateMessage): Promise<CreateMessageReturnType>;
    getAll(query: MessageQuery, chatId: string): Promise<PaginateType<IMessage>>;
    markAllAsRead(chatId: string, userId: number): Promise<boolean>;
}
declare const messageService: MessageService;
export default messageService;
