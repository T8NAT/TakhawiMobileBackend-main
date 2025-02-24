import { QueryType } from './queryType';

export interface Vehicle {
  id: number;
  serial_no: string;
  plate_alphabet: string;
  plate_alphabet_ar: string;
  plate_number: string;
  seats_no: number;
  vehicle_color_id: number;
  vehicle_class_id: number;
  vehicle_type_id: number;
  vehicle_name_id: number;
  production_year: number;
  driverId: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  Vehicle_Color?: VehicleDetails;
  Vehicle_Class?: VehicleDetails;
  Vehicle_Type?: VehicleDetails;
  Vehicle_Name?: VehicleDetails;
}

export interface VehicleDetails {
  ar_name: string;
  en_name: string;
}

export interface VehicleImage {
  id: number;
  file_path: string;
  vehicle_id?: number | null;
  temp_id?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrphanedUpload {
  model: string;
  id: number;
  file_path: string;
}

export type CreateVehicle = Omit<
  Vehicle,
  | 'id'
  | 'createdAt'
  | 'updatedAt'
  | 'deletedAt'
  | 'Vehicle_Color'
  | 'Vehicle_Class'
  | 'Vehicle_Type'
  | 'Vehicle_Name'
>;

export type UpdateVehicle = Omit<Partial<CreateVehicle>, 'driverId'>;
export type CreateVehicleImage = Omit<
  VehicleImage,
  'id' | 'createdAt' | 'updatedAt'
>;
export type VehicleQueryType = QueryType & {
  production_year?: number;
  seats_no?: number;
};
