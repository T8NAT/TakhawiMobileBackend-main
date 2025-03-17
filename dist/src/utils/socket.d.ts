/// <reference types="i18n" />
/// <reference types="express-serve-static-core" />
/// <reference types="multer" />
/// <reference types="node" />
import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'node:http';
declare const i18nInit: (request: Express.Request, response: Express.Response, next?: (() => void) | undefined) => void;
declare const app: import("express-serve-static-core").Express;
declare const server: HTTPServer<typeof import("http").IncomingMessage, typeof import("http").ServerResponse>;
declare const io: SocketIOServer<import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, any>;
export { app, server, io, i18nInit, };
