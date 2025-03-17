import { Server } from 'socket.io';
import { CreateMessage } from '../types/messageType';
export declare const updateLocation: (location: {
    lat: number;
    lng: number;
}, userId: number, io: Server) => Promise<void>;
export declare const sendMessage: (data: CreateMessage, io: Server) => Promise<void>;
export declare const joinChatRoom: (data: any) => Promise<void>;
export declare const leaveChatRoom: (socketId: string, chatId?: string) => Promise<void>;
