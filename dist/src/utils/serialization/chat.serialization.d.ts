import IChat from '../../types/chatType';
export declare const serializeChat: (chat: IChat & {
    _count: {
        Messages: number;
    };
}) => {
    User: import("../../types/userType").User | undefined;
    unread_messages: number;
    last_message: import("../../types/messageType").default | null;
    id: string;
    userId: number;
    driverId: number;
    tripId: number;
    is_active: boolean;
};
export declare const serializeChats: (chats: (IChat & {
    _count: {
        Messages: number;
    };
})[]) => {
    User: import("../../types/userType").User | undefined;
    unread_messages: number;
    last_message: import("../../types/messageType").default | null;
    id: string;
    userId: number;
    driverId: number;
    tripId: number;
    is_active: boolean;
}[];
