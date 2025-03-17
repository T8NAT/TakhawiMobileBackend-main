import { Request, Response, NextFunction } from 'express';
declare class NotificationController {
    create(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAll(req: Request, res: Response, next: NextFunction): Promise<void>;
    markAsRead(req: Request, res: Response, next: NextFunction): Promise<void>;
    markAllAsRead(req: Request, res: Response, next: NextFunction): Promise<void>;
    delete(req: Request, res: Response, next: NextFunction): Promise<void>;
    sendNotification(req: Request, res: Response, next: NextFunction): Promise<void>;
}
declare const notificationController: NotificationController;
export default notificationController;
