import IChat, { ChatQuery, CreateChat } from '../types/chatType';
import { PaginateType } from '../types/paginateType';

export default interface IChatService {
  openChat(chat: CreateChat): Promise<IChat>;
  getAll(
    query: ChatQuery,
    role: string,
    userId: number,
  ): Promise<PaginateType<IChat>>;
}
