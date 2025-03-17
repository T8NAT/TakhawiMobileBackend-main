import { Vehicle_Production_Start_Year } from '@prisma/client';
import { IVehicleDetailsService } from '../interfaces/vehicleDetailsService';
import { CreateVehicleDetail, UpdateVehicleDetail, VehicleDetail, VehicleType, CreateVehicleType, modelNameType } from '../types/vehicleDetailsType';
declare class VehicleDetailsService implements IVehicleDetailsService {
    checkNameExists(modelName: modelNameType, data: UpdateVehicleDetail, id?: number): Promise<void>;
    getVehicleDetails(modelName: modelNameType): Promise<VehicleDetail[]>;
    getVehicleDetailById(modelName: modelNameType, id: number): Promise<VehicleDetail>;
    createVehicleDetail(modelName: modelNameType, data: CreateVehicleDetail): Promise<VehicleDetail>;
    updateVehicleDetail(modelName: modelNameType, id: number, data: UpdateVehicleDetail): Promise<VehicleDetail>;
    deleteVehicleDetail(modelName: modelNameType, id: number): Promise<VehicleDetail>;
    createVehicleProductionStartYear(startYear: number): Promise<Vehicle_Production_Start_Year>;
    createVehicleType(modelName: modelNameType, data: CreateVehicleType): Promise<VehicleType>;
    updateVehicleType(modelName: modelNameType, id: number, data: UpdateVehicleDetail): Promise<VehicleType>;
    getVehicleProductionStartYear(): Promise<Vehicle_Production_Start_Year>;
    updateVehicleProductionStartYear(startYear: number): Promise<Vehicle_Production_Start_Year>;
    getAllVehicleDetails(): Promise<{
        vehicleColor: VehicleDetail[];
        vehicleClass: VehicleDetail[];
        vehicleTypes: VehicleDetail[];
        vehicleName: VehicleDetail[];
        start_year: number;
    }>;
}
declare const vehicleDetailsService: VehicleDetailsService;
export default vehicleDetailsService;
