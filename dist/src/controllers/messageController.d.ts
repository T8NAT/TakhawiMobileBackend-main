import { Request, Response, NextFunction } from 'express';
declare class MessageController {
    sendMessage(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAll(req: Request, res: Response, next: NextFunction): Promise<void>;
    markAllAsRead(req: Request, res: Response, next: NextFunction): Promise<void>;
}
declare const messageController: MessageController;
export default messageController;
