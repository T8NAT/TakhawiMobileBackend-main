export interface VehicleDetail {
  id: number;
  ar_name: string;
  en_name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface VehicleType extends VehicleDetail {
  file_path: string;
}
export type CreateVehicleDetail = Omit<
  VehicleDetail,
  'id' | 'createdAt' | 'updatedAt'
>;
export type CreateVehicleType = CreateVehicleDetail & { file_path: string };
export type UpdateVehicleDetail = Partial<CreateVehicleDetail>;
export type modelNameType =
  | 'vehicle_Color'
  | 'vehicle_Class'
  | 'vehicle_Name'
  | 'vehicle_Type';
