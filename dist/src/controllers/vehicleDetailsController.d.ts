import { Request, Response, NextFunction } from 'express';
import { modelNameType } from '../types/vehicleDetailsType';
declare class VehicleDetailController {
    static modelName: Record<string, modelNameType>;
    getVehicleColors(req: Request, res: Response, next: NextFunction): Promise<void>;
    getVehicleColorById(req: Request, res: Response, next: NextFunction): Promise<void>;
    createVehicleColor(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateVehicleColor(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteVehicleColor(req: Request, res: Response, next: NextFunction): Promise<void>;
    getVehicleClasses(req: Request, res: Response, next: NextFunction): Promise<void>;
    getVehicleClassById(req: Request, res: Response, next: NextFunction): Promise<void>;
    createVehicleClass(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateVehicleClass(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteVehicleClass(req: Request, res: Response, next: NextFunction): Promise<void>;
    getVehicleTypes(req: Request, res: Response, next: NextFunction): Promise<void>;
    getVehicleTypeById(req: Request, res: Response, next: NextFunction): Promise<void>;
    createVehicleType(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateVehicleType(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteVehicleType(req: Request, res: Response, next: NextFunction): Promise<void>;
    getVehicleNames(req: Request, res: Response, next: NextFunction): Promise<void>;
    getVehicleNameById(req: Request, res: Response, next: NextFunction): Promise<void>;
    createVehicleName(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateVehicleName(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteVehicleName(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAllVehicleDetails(req: Request, res: Response, next: NextFunction): Promise<void>;
    createVehicleProductionStartYear(req: Request, res: Response, next: NextFunction): Promise<void>;
    getVehicleProductionStartYear(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateVehicleProductionStartYear(req: Request, res: Response, next: NextFunction): Promise<void>;
}
declare const vehicleDetailController: VehicleDetailController;
export default vehicleDetailController;
