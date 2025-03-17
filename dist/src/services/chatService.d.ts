import IChatService from '../interfaces/chatService';
import IChat, { ChatQuery, CreateChat } from '../types/chatType';
import { PaginateType } from '../types/paginateType';
declare class ChatService implements IChatService {
    openChat(data: CreateChat): Promise<IChat>;
    getAll(query: ChatQuery, role: string, userId: number): Promise<PaginateType<IChat & {
        _count: {
            Messages: number;
        };
    }>>;
    private validateOpenChatMethod;
}
declare const chatService: ChatService;
export default chatService;
