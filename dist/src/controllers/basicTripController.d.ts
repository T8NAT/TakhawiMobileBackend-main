import { Request, Response, NextFunction } from 'express';
declare class BasicTripController {
    applepayJoin(req: Request, res: Response): Promise<void>;
    create(req: Request, res: Response, next: NextFunction): Promise<void>;
    get(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAll(req: Request, res: Response, next: NextFunction): Promise<void>;
    join(req: Request, res: Response, next: NextFunction): Promise<void>;
    cancelBYDriver(req: Request, res: Response, next: NextFunction): Promise<void>;
    cancelByPassenger(req: Request, res: Response, next: NextFunction): Promise<void>;
    endTrip(req: Request, res: Response, next: NextFunction): Promise<void>;
    calculateTripPrice(req: Request, res: Response, next: NextFunction): Promise<void>;
    markPassengerAsArrived(req: Request, res: Response, next: NextFunction): Promise<void>;
}
declare const basicTripController: BasicTripController;
export default basicTripController;
