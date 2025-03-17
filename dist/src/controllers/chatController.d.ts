import { Request, Response, NextFunction } from 'express';
declare class ChatController {
    openChat(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAll(req: Request, res: Response, next: NextFunction): Promise<void>;
}
declare const chatController: ChatController;
export default chatController;
