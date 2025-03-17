import { Request, Response, NextFunction } from 'express';
declare class AppConfigController {
    create(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAll(req: Request, res: Response, next: NextFunction): Promise<void>;
    delete(req: Request, res: Response, next: NextFunction): Promise<void>;
}
declare const appConfigController: AppConfigController;
export default appConfigController;
