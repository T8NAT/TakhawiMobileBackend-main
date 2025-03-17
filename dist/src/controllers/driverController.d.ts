import { Request, Response, NextFunction } from 'express';
declare class DriverController {
    uploadNationalID(req: Request, res: Response, next: NextFunction): Promise<void>;
    uploadDriverLicense(req: Request, res: Response, next: NextFunction): Promise<void>;
    checkUploadStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
    getNearestDrivers(req: Request, res: Response, next: NextFunction): Promise<void>;
}
declare const driverController: DriverController;
export default driverController;
