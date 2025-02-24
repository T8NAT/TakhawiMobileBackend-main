import { Server } from 'socket.io';
import prisma from '../../prisma/client';
import { TripStatus } from '../enum/trip';
import { CreateMessage } from '../types/messageType';
import messageService from '../services/messagesService';
import { FCMToken } from '../types/userType';
import sendPushNotification from './pushNotification';
// import { io } from './socket';

export const updateLocation = async (
  location: { lat: number; lng: number },
  userId: number,
  io: Server,
) => {
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      location,
    },
  });
  const trip = await prisma.trip.findFirst({
    where: {
      driver_id: userId,
      status: TripStatus.ON_WAY,
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
      passengers = trip.Basic_Trip.Passengers.map(
        (passenger) => passenger.Passnger.uuid,
      );
    }
    io.to(passengers).emit('driver location', location);
  }
};

export const sendMessage = async (data: CreateMessage, io: Server) => {
  const { sockets, fcms, reciverId, usersId, language, ...rest } =
    await messageService.sendMessage(data);
  if (sockets.length > 0) io.to(sockets).emit('message', rest);
  if (!usersId.includes(reciverId) && fcms.length > 0) {
    const tokens = fcms.map((fcm: FCMToken) => fcm.token);
    sendPushNotification({
      title: language === 'ar' ? 'رسالة جديدة' : 'New Message',
      body: data.content,
      tokens,
    });
  }
};

export const joinChatRoom = async (data: any) => {
  await prisma.chatRoom.upsert({
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

export const leaveChatRoom = async (socketId: string, chatId?: string) => {
  await prisma.chatRoom.deleteMany({
    where: {
      socketId,
      chatId,
    },
  });
};
