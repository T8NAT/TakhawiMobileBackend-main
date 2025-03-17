import { Request, Response, NextFunction } from 'express';
declare class UserManagementController {
    updateLocation(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateDriverStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
    updatePassengerStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
    createFCMToken(req: Request, res: Response, next: NextFunction): Promise<void>;
    switchToDriver(req: Request, res: Response, next: NextFunction): Promise<void>;
    switchToUser(req: Request, res: Response, next: NextFunction): Promise<void>;
}
declare const userManagementController: UserManagementController;
export default userManagementController;
