import {
  Vehicle,
  CreateVehicle,
  UpdateVehicle,
  VehicleQueryType,
  VehicleImage,
} from '../types/vehicleType';

export interface IVehicleService {
  create(vehicle: CreateVehicle, temp_id: string): Promise<Vehicle>;
  getAll(queryString: VehicleQueryType): Promise<PaginateType<Vehicle>>;
  getOne(vehicleId: number, driverId?: number): Promise<Vehicle>;
  update(
    vehicle: UpdateVehicle,
    vehicleId: number,
    driverId?: number,
  ): Promise<Vehicle>;
  delete(vehicleId: number, driverId?: number): Promise<void>;
  uploadVehicleImages(
    tempId: string,
    images: Express.Multer.File[],
  ): Promise<{ count: number }>;
  uploadVehicleLicence(
    tempId: string,
    images: Express.Multer.File[],
  ): Promise<{ count: number }>;
  uploadVehicleInsurance(
    tempId: string,
    file_path: string,
  ): Promise<VehicleImage>;
}
