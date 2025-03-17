import { Request, Response, NextFunction } from 'express';
declare class SavedCardController {
    create(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAll(req: Request, res: Response, next: NextFunction): Promise<void>;
    delete(req: Request, res: Response, next: NextFunction): Promise<void>;
    createUserBillingInfo(req: Request, res: Response, next: NextFunction): Promise<void>;
    getUserBillingInfo(req: Request, res: Response, next: NextFunction): Promise<void>;
}
declare const savedCardController: SavedCardController;
export default savedCardController;
