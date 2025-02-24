import IChat from '../../types/chatType';

export const serializeChat = (
  chat: IChat & { _count: { Messages: number } },
) => {
  const { User, Driver, _count, Messages, ...rest } = chat;
  return {
    ...rest,
    User: Driver ? Driver : User,
    unread_messages: _count.Messages,
    last_message: Messages && Messages.length > 0 ? Messages[0] : null,
  };
};

export const serializeChats = (
  chats: (IChat & { _count: { Messages: number } })[],
) => chats.map((chat) => serializeChat(chat));
