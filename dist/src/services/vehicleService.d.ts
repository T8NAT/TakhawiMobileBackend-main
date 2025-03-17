/// <reference types="multer" />
import { IVehicleService } from '../interfaces/vehicleService';
import { Vehicle, CreateVehicle, UpdateVehicle, VehicleQueryType, VehicleImage } from '../types/vehicleType';
import { PaginateType } from '../types/paginateType';
import { FileMap } from '../types/files';
declare class VehicleService implements IVehicleService {
    create(data: CreateVehicle, temp_id: string): Promise<Vehicle>;
    getAll(queryString: VehicleQueryType): Promise<PaginateType<Vehicle>>;
    getOne(vehicleId: number, driverId?: number): Promise<Vehicle>;
    update(data: UpdateVehicle, vehicleId: number, driverId?: number): Promise<Vehicle>;
    delete(vehicleId: number, driverId?: number): Promise<void>;
    uploadVehicleLicence(temp_id: string, files: Express.Multer.File[]): Promise<{
        count: number;
    }>;
    uploadVehicleImages(temp_id: string, files: Express.Multer.File[]): Promise<{
        count: number;
    }>;
    uploadVehicleInsurance(temp_id: string, file_path: string): Promise<VehicleImage>;
    addNewVehicle(data: CreateVehicle, files: FileMap): Promise<Vehicle>;
    cleanupOrphanUploads(): Promise<void>;
    private updateVehicleImagesAndInsurance;
    private existingVehicleCheck;
}
declare const vehicleService: VehicleService;
export default vehicleService;
