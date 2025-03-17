"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaveChatRoom = exports.joinChatRoom = exports.sendMessage = exports.updateLocation = void 0;
const client_1 = __importDefault(require("../../prisma/client"));
const trip_1 = require("../enum/trip");
const messagesService_1 = __importDefault(require("../services/messagesService"));
const pushNotification_1 = __importDefault(require("./pushNotification"));
// import { io } from './socket';
const updateLocation = async (location, userId, io) => {
    await client_1.default.user.update({
        where: {
            id: userId,
        },
        data: {
            location,
        },
    });
    const trip = await client_1.default.trip.findFirst({
        where: {
            driver_id: userId,
            status: trip_1.TripStatus.ON_WAY,
        },
        select: {
            type: true,
            VIP_Trip: {
                select: {
                    Passnger: {
                        select: {
                            uuid: true,
                        },
                    },
                },
            },
            Basic_Trip: {
                select: {
                    Passengers: {
                        select: {
                            Passnger: {
                                select: {
                                    uuid: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });
    if (trip) {
        let passengers = [];
        if (trip.VIP_Trip) {
            passengers.push(trip.VIP_Trip.Passnger.uuid);
        }
        if (trip.Basic_Trip) {
            passengers = trip.Basic_Trip.Passengers.map((passenger) => passenger.Passnger.uuid);
        }
        io.to(passengers).emit('driver location', location);
    }
};
exports.updateLocation = updateLocation;
const sendMessage = async (data, io) => {
    const { sockets, fcms, reciverId, usersId, language, ...rest } = await messagesService_1.default.sendMessage(data);
    if (sockets.length > 0)
        io.to(sockets).emit('message', rest);
    if (!usersId.includes(reciverId) && fcms.length > 0) {
        const tokens = fcms.map((fcm) => fcm.token);
        (0, pushNotification_1.default)({
            title: language === 'ar' ? 'رسالة جديدة' : 'New Message',
            body: data.content,
            tokens,
        });
    }
};
exports.sendMessage = sendMessage;
const joinChatRoom = async (data) => {
    await client_1.default.chatRoom.upsert({
        where: {
            userId_chatId_socketId: {
                userId: data.userId,
                chatId: data.chatId,
                socketId: data.socketId,
            },
        },
        create: {
            userId: data.userId,
            chatId: data.chatId,
            socketId: data.socketId,
        },
        update: {
            socketId: data.socketId,
        },
    });
};
exports.joinChatRoom = joinChatRoom;
const leaveChatRoom = async (socketId, chatId) => {
    await client_1.default.chatRoom.deleteMany({
        where: {
            socketId,
            chatId,
        },
    });
};
exports.leaveChatRoom = leaveChatRoom;
