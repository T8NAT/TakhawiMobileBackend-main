import { Request, Response, NextFunction } from 'express';
declare class UserContorller {
    create(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAll(req: Request, res: Response, next: NextFunction): Promise<void>;
    getDrivers(req: Request, res: Response, next: NextFunction): Promise<void>;
    getOne(req: Request, res: Response, next: NextFunction): Promise<void>;
    getProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
}
declare const userController: UserContorller;
export default userController;
