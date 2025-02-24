import {
  CreateVehicleDetail,
  UpdateVehicleDetail,
  VehicleDetail,
  modelNameType,
} from '../types/vehicleDetailsType';

export interface IVehicleDetailsService {
  getVehicleDetails: (modelName: modelNameType) => Promise<VehicleDetail[]>;
  getVehicleDetailById: (
    modelName: modelNameType,
    id: number,
  ) => Promise<VehicleDetail>;
  createVehicleDetail: (
    modelName: modelNameType,
    data: CreateVehicleDetail,
  ) => Promise<VehicleDetail>;
  updateVehicleDetail: (
    modelName: modelNameType,
    id: number,
    data: UpdateVehicleDetail,
  ) => Promise<VehicleDetail>;
  deleteVehicleDetail: (
    modelName: modelNameType,
    id: number,
  ) => Promise<VehicleDetail>;
}
