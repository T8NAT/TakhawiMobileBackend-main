import { Vehicle, VehicleDetails } from '../../types/vehicleType';
import { Language } from '../../types/languageType';

export const serializeVehicleDetail = (
  detail: VehicleDetails,
  lang: Language,
) => {
  const { ar_name: arName, en_name: enName, ...rest } = detail;
  return {
    ...rest,
    name: detail[`${lang}_name`],
  };
};

export const serializeVehicleDetails = (
  details: VehicleDetails[],
  lang: Language,
) => details.map((detail) => serializeVehicleDetail(detail, lang));

export const serializeVehicle = (vehicle: Vehicle, lang: Language) => ({
  ...vehicle,
  Vehicle_Color: vehicle.Vehicle_Color
    ? serializeVehicleDetail(vehicle.Vehicle_Color, lang)
    : undefined,
  Vehicle_Class: vehicle.Vehicle_Class
    ? serializeVehicleDetail(vehicle.Vehicle_Class, lang)
    : undefined,
  Vehicle_Type: vehicle.Vehicle_Type
    ? serializeVehicleDetail(vehicle.Vehicle_Type, lang)
    : undefined,
  Vehicle_Name: vehicle.Vehicle_Name
    ? serializeVehicleDetail(vehicle.Vehicle_Name, lang)
    : undefined,
});

export const serializeVehicles = (vehicles: Vehicle[], lang: Language) =>
  vehicles.map((vehicle) => serializeVehicle(vehicle, lang));
