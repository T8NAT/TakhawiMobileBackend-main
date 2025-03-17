import { Request, Response, NextFunction } from 'express';
declare class VipTripController {
    create(req: Request, res: Response, next: NextFunction): Promise<void>;
    cancel(req: Request, res: Response, next: NextFunction): Promise<void>;
    driverCancelation(req: Request, res: Response, next: NextFunction): Promise<void>;
    getTripOffers(req: Request, res: Response, next: NextFunction): Promise<void>;
    endTrip(req: Request, res: Response, next: NextFunction): Promise<void>;
    getOne(req: Request, res: Response, next: NextFunction): Promise<void>;
}
declare const vipTripController: VipTripController;
export default vipTripController;
