import { Request, Response, NextFunction } from 'express';
declare class SettlementRequestService {
    create(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAll(req: Request, res: Response, next: NextFunction): Promise<void>;
    getOne(req: Request, res: Response, next: NextFunction): Promise<void>;
    cancel(req: Request, res: Response, next: NextFunction): Promise<void>;
    approve(req: Request, res: Response, next: NextFunction): Promise<void>;
    deny(req: Request, res: Response, next: NextFunction): Promise<void>;
}
declare const settlementRequestController: SettlementRequestService;
export default settlementRequestController;
