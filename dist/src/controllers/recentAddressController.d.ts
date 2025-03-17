import { Request, Response, NextFunction } from 'express';
declare class RecentAddressController {
    create(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAll(req: Request, res: Response, next: NextFunction): Promise<void>;
    delete(req: Request, res: Response, next: NextFunction): Promise<void>;
}
declare const recentAddressController: RecentAddressController;
export default recentAddressController;
