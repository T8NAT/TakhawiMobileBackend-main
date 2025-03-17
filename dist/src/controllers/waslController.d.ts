import { Request, Response, NextFunction } from 'express';
declare class WaslController {
    createDriverandVehicleRegistration(req: Request, res: Response, next: NextFunction): Promise<void>;
    getDriverandVehicleRegistration(req: Request, res: Response, next: NextFunction): Promise<void>;
    createTripRegistration(req: Request, res: Response, next: NextFunction): Promise<void>;
    getTripsLog(req: Request, res: Response, next: NextFunction): Promise<void>;
}
declare const waslController: WaslController;
export default waslController;
