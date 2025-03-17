import { Request, Response, NextFunction } from 'express';
declare class WarningController {
    getOne(req: Request, res: Response, next: NextFunction): Promise<void>;
    create(req: Request, res: Response, next: NextFunction): Promise<void>;
    delete(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAll(req: Request, res: Response, next: NextFunction): Promise<void>;
}
declare const warningController: WarningController;
export default warningController;
