import { Socket, Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'node:http';
import express, { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import helmet from 'helmet';
import i18n from './i18n';
import { Payload } from '../types/payloadType';
import SocketRequest from '../interfaces/socketRequest';
import prisma from '../../prisma/client';
import setLanguage from '../middlewares/set-language';
import {
  joinChatRoom,
  leaveChatRoom,
  sendMessage,
  updateLocation,
} from './socket-events';
import { updateLocationSchema } from '../validations/userValidations';
import { sendMessageSchema } from '../validations/chatValidations';
import { CreateMessage } from '../types/messageType';

const i18nInit = i18n.init;
const app = express();
const server = new HTTPServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  },
});

// Middleware using socket.io's engine middleware
io.engine.use(helmet());
io.engine.use(i18nInit);
io.engine.use(setLanguage);

const terminateSocket = (socket: Socket, message: string) => {
  socket.emit('disconnect reason', i18n.__(message));
  socket.disconnect(true);
};

io.engine.use((req: SocketRequest, res: Response, next: NextFunction) => {
  const isHandshake = req._query.sid === undefined;
  if (!isHandshake) {
    return next();
  }

  const header = req.headers.authorization;
  if (!header) {
    console.log('no token');
    return next(new Error('no token'));
  }

  try {
    const token = header.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.SECRET_KEY_ACCESSTOKEN!);
    const payload = decoded as Payload;
    req.userId = payload.id;
    req.role = payload.role;
  } catch (error) {
    console.log('invalid token');
    return next(new Error('invalid token'));
  }
  next();
});

io.on('connection', async (socket) => {
  const { userId } = socket.request as SocketRequest;
  const user = await prisma.user.findUnique({
    where: { uuid: userId },
    select: {
      id: true,
      deletedAt: true,
    },
  });
  if (!user) {
    console.log('User not found');
    terminateSocket(socket, 'User not found');
    return;
  }
  if (user.deletedAt) {
    terminateSocket(socket, 'Deleted Account');
    console.log('Deleted Account');
    return;
  }

  socket.join(userId!); // Join the room with the user UUID
  // If you want to get the last socket id in the room & emit to that socket
  // const room = io.sockets.adapter.rooms.get(userId!);
  // const socketIds = Array.from(room!);
  // const lastSocketId = socketIds[socketIds.length - 1];
  console.log('user connected', userId);
  socket.on('update location', async (location) => {
    try {
      // VALIDATING THE LOCATION OBJECT
      const { error } = updateLocationSchema.validate(location);
      if (error) {
        throw new Error(error.details[0].message);
      }
      // SENDING IO TO REMOVE THE DEPENDENCY
      await updateLocation(location, user.id, io);
    } catch (err: any) {
      io.to(socket.id).emit('error', {
        status: false,
        message: i18n.__(err.message),
      });
    }
  });
  socket.on('message', async (message: CreateMessage) => {
    try {
      // VALIDATING THE LOCATION OBJECT
      const { error } = sendMessageSchema.validate(message);
      if (error) {
        throw new Error(error.details[0].message);
      }
      // SENDING IO TO REMOVE THE DEPENDENCY
      await sendMessage(
        {
          ...message,
          senderId: user.id,
        },
        io,
      );
    } catch (err: any) {
      io.to(socket.id).emit('error', {
        status: false,
        message: i18n.__(err.message),
      });
    }
  });
  socket.on('join chat', async (data: { chatId: string }) => {
    try {
      await joinChatRoom({
        chatId: data.chatId,
        userId: user.id,
        socketId: socket.id,
      });
    } catch (err: any) {
      io.to(socket.id).emit('error', {
        status: false,
        message: err.message,
      });
    }
  });
  socket.on('leave chat', async (data: { chatId: string }) => {
    try {
      await leaveChatRoom(socket.id, data.chatId);
    } catch (err: any) {
      io.to(socket.id).emit('error', {
        status: false,
        message: err.message,
      });
    }
  });
  socket.on('disconnect', async () => {
    // Temporary solution
    await prisma.user.update({
      where: { id: user.id },
      data: {
        location: {},
      },
    });
    await leaveChatRoom(socket.id);
    console.log('user disconnected');
  });
});

export { app, server, io, i18nInit };
