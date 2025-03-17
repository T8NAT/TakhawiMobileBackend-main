import { Vehicle, VehicleDetails } from '../../types/vehicleType';
import { Language } from '../../types/languageType';
export declare const serializeVehicleDetail: (detail: VehicleDetails, lang: Language) => {
    name: string;
};
export declare const serializeVehicleDetails: (details: VehicleDetails[], lang: Language) => {
    name: string;
}[];
export declare const serializeVehicle: (vehicle: Vehicle, lang: Language) => {
    Vehicle_Color: {
        name: string;
    } | undefined;
    Vehicle_Class: {
        name: string;
    } | undefined;
    Vehicle_Type: {
        name: string;
    } | undefined;
    Vehicle_Name: {
        name: string;
    } | undefined;
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
};
export declare const serializeVehicles: (vehicles: Vehicle[], lang: Language) => {
    Vehicle_Color: {
        name: string;
    } | undefined;
    Vehicle_Class: {
        name: string;
    } | undefined;
    Vehicle_Type: {
        name: string;
    } | undefined;
    Vehicle_Name: {
        name: string;
    } | undefined;
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
}[];
