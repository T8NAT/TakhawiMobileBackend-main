"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.i18nInit = exports.io = exports.server = exports.app = void 0;
const socket_io_1 = require("socket.io");
const node_http_1 = require("node:http");
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const helmet_1 = __importDefault(require("helmet"));
const i18n_1 = __importDefault(require("./i18n"));
const client_1 = __importDefault(require("../../prisma/client"));
const set_language_1 = __importDefault(require("../middlewares/set-language"));
const socket_events_1 = require("./socket-events");
const userValidations_1 = require("../validations/userValidations");
const chatValidations_1 = require("../validations/chatValidations");
const i18nInit = i18n_1.default.init;
exports.i18nInit = i18nInit;
const app = (0, express_1.default)();
exports.app = app;
const server = new node_http_1.Server(app);
exports.server = server;
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    },
});
exports.io = io;
// Middleware using socket.io's engine middleware
io.engine.use((0, helmet_1.default)());
io.engine.use(i18nInit);
io.engine.use(set_language_1.default);
const terminateSocket = (socket, message) => {
    socket.emit('disconnect reason', i18n_1.default.__(message));
    socket.disconnect(true);
};
io.engine.use((req, res, next) => {
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
        const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY_ACCESSTOKEN);
        const payload = decoded;
        req.userId = payload.id;
        req.role = payload.role;
    }
    catch (error) {
        console.log('invalid token');
        return next(new Error('invalid token'));
    }
    next();
});
io.on('connection', async (socket) => {
    const { userId } = socket.request;
    const user = await client_1.default.user.findUnique({
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
    socket.join(userId); // Join the room with the user UUID
    // If you want to get the last socket id in the room & emit to that socket
    // const room = io.sockets.adapter.rooms.get(userId!);
    // const socketIds = Array.from(room!);
    // const lastSocketId = socketIds[socketIds.length - 1];
    console.log('user connected', userId);
    socket.on('update location', async (location) => {
        try {
            // VALIDATING THE LOCATION OBJECT
            const { error } = userValidations_1.updateLocationSchema.validate(location);
            if (error) {
                throw new Error(error.details[0].message);
            }
            // SENDING IO TO REMOVE THE DEPENDENCY
            await (0, socket_events_1.updateLocation)(location, user.id, io);
        }
        catch (err) {
            io.to(socket.id).emit('error', {
                status: false,
                message: i18n_1.default.__(err.message),
            });
        }
    });
    socket.on('message', async (message) => {
        try {
            // VALIDATING THE LOCATION OBJECT
            const { error } = chatValidations_1.sendMessageSchema.validate(message);
            if (error) {
                throw new Error(error.details[0].message);
            }
            // SENDING IO TO REMOVE THE DEPENDENCY
            await (0, socket_events_1.sendMessage)({
                ...message,
                senderId: user.id,
            }, io);
        }
        catch (err) {
            io.to(socket.id).emit('error', {
                status: false,
                message: i18n_1.default.__(err.message),
            });
        }
    });
    socket.on('join chat', async (data) => {
        try {
            await (0, socket_events_1.joinChatRoom)({
                chatId: data.chatId,
                userId: user.id,
                socketId: socket.id,
            });
        }
        catch (err) {
            io.to(socket.id).emit('error', {
                status: false,
                message: err.message,
            });
        }
    });
    socket.on('leave chat', async (data) => {
        try {
            await (0, socket_events_1.leaveChatRoom)(socket.id, data.chatId);
        }
        catch (err) {
            io.to(socket.id).emit('error', {
                status: false,
                message: err.message,
            });
        }
    });
    socket.on('disconnect', async () => {
        // Temporary solution
        await client_1.default.user.update({
            where: { id: user.id },
            data: {
                location: {},
            },
        });
        await (0, socket_events_1.leaveChatRoom)(socket.id);
        console.log('user disconnected');
    });
});
