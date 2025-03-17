import { Request } from 'express';
export default interface SocketRequest extends Request {
    _query: {
        sid?: string;
    };
    userId?: string;
    role?: string;
}
