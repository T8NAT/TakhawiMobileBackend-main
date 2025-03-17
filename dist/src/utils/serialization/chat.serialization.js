"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeChats = exports.serializeChat = void 0;
const serializeChat = (chat) => {
    const { User, Driver, _count, Messages, ...rest } = chat;
    return {
        ...rest,
        User: Driver ? Driver : User,
        unread_messages: _count.Messages,
        last_message: Messages && Messages.length > 0 ? Messages[0] : null,
    };
};
exports.serializeChat = serializeChat;
const serializeChats = (chats) => chats.map((chat) => (0, exports.serializeChat)(chat));
exports.serializeChats = serializeChats;
