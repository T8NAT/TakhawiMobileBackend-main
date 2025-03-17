import { Request, Response, NextFunction } from 'express';
declare class VehicleController {
    create(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAll(req: Request, res: Response, next: NextFunction): Promise<void>;
    getOne(req: Request, res: Response, next: NextFunction): Promise<void>;
    update(req: Request, res: Response, next: NextFunction): Promise<void>;
    delete(req: Request, res: Response, next: NextFunction): Promise<void>;
    uploadVehicleImages(req: Request, res: Response, next: NextFunction): Promise<void>;
    uploadVehicleLicence(req: Request, res: Response, next: NextFunction): Promise<void>;
    uploadVehicleInsurance(req: Request, res: Response, next: NextFunction): Promise<void>;
    addNewVehicle(req: Request, res: Response, next: NextFunction): Promise<void>;
}
declare const vehicleController: VehicleController;
export default vehicleController;
