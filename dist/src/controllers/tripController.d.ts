import { Request, Response, NextFunction } from 'express';
declare class TripController {
    getCompletedTrips(req: Request, res: Response, next: NextFunction): Promise<void>;
    getCancelledTrips(req: Request, res: Response, next: NextFunction): Promise<void>;
    getUpcomingTrips(req: Request, res: Response, next: NextFunction): Promise<void>;
    getTrips(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateTripStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
    getNearByVipTrips(req: Request, res: Response, next: NextFunction): Promise<void>;
    getNearByVipTripsByDistance(req: Request, res: Response, next: NextFunction): Promise<void>;
    getOne(req: Request, res: Response, next: NextFunction): Promise<void>;
}
declare const tripController: TripController;
export default tripController;
