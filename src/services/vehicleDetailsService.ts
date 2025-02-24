import { Vehicle_Production_Start_Year } from '@prisma/client';
import { IVehicleDetailsService } from '../interfaces/vehicleDetailsService';
import prisma from '../../prisma/client';
import {
  CreateVehicleDetail,
  UpdateVehicleDetail,
  VehicleDetail,
  VehicleType,
  CreateVehicleType,
  modelNameType,
} from '../types/vehicleDetailsType';
import ApiError from '../utils/ApiError';

class VehicleDetailsService implements IVehicleDetailsService {
  async checkNameExists(
    modelName: modelNameType,
    data: UpdateVehicleDetail,
    id?: number,
  ): Promise<void> {
    // @ts-ignore
    const vehicleDetail = await prisma[modelName].findMany({
      where: {
        id: id ? { not: id } : undefined,
        OR: [
          {
            en_name: {
              contains: data.en_name,
              mode: 'insensitive',
            },
          },
          {
            ar_name: {
              contains: data.ar_name,
              mode: 'insensitive',
            },
          },
        ],
      },
    });

    if (vehicleDetail.length > 0) {
      throw new ApiError(`${modelName.replace('_', ' ')} already exists`, 400);
    }
  }

  async getVehicleDetails(modelName: modelNameType): Promise<VehicleDetail[]> {
    // @ts-ignore
    return prisma[modelName].findMany();
  }

  async getVehicleDetailById(
    modelName: modelNameType,
    id: number,
  ): Promise<VehicleDetail> {
    // @ts-ignore
    const vehicleDetail = await prisma[modelName].findUnique({ where: { id } });
    if (!vehicleDetail) {
      throw new ApiError(`${modelName.replace('_', ' ')} not found`, 404);
    }
    return vehicleDetail;
  }

  async createVehicleDetail(
    modelName: modelNameType,
    data: CreateVehicleDetail,
  ): Promise<VehicleDetail> {
    await this.checkNameExists(modelName, data);
    // @ts-ignore
    return prisma[modelName].create({ data });
  }

  async updateVehicleDetail(
    modelName: modelNameType,
    id: number,
    data: UpdateVehicleDetail,
  ): Promise<VehicleDetail> {
    await this.getVehicleDetailById(modelName, id);
    await this.checkNameExists(modelName, data, id);
    // @ts-ignore
    return prisma[modelName].update({ where: { id }, data });
  }

  async deleteVehicleDetail(
    modelName: modelNameType,
    id: number,
  ): Promise<VehicleDetail> {
    await this.getVehicleDetailById(modelName, id);
    // @ts-ignore
    return prisma[modelName].delete({ where: { id } });
  }

  async createVehicleProductionStartYear(
    startYear: number,
  ): Promise<Vehicle_Production_Start_Year> {
    const vehicleProductionStartYear =
      await prisma.vehicle_Production_Start_Year.findFirst();
    if (vehicleProductionStartYear) {
      throw new ApiError('Vehicle production start year already exists', 400);
    }
    return prisma.vehicle_Production_Start_Year.create({
      data: { start_year: startYear },
    });
  }

  async createVehicleType(
    modelName: modelNameType,
    data: CreateVehicleType,
  ): Promise<VehicleType> {
    await this.checkNameExists(modelName, data);
    return prisma.vehicle_Type.create({ data });
  }

  async updateVehicleType(
    modelName: modelNameType,
    id: number,
    data: UpdateVehicleDetail,
  ): Promise<VehicleType> {
    await this.getVehicleDetailById(modelName, id);
    await this.checkNameExists(modelName, data, id);
    return prisma.vehicle_Type.update({ where: { id }, data });
  }

  async getVehicleProductionStartYear(): Promise<Vehicle_Production_Start_Year> {
    const vehicleProductionStartYear =
      await prisma.vehicle_Production_Start_Year.findFirst();
    if (!vehicleProductionStartYear) {
      throw new ApiError('Vehicle production start year not found', 404);
    }
    return vehicleProductionStartYear;
  }

  async updateVehicleProductionStartYear(
    startYear: number,
  ): Promise<Vehicle_Production_Start_Year> {
    const vehicleProductionStartYear =
      await prisma.vehicle_Production_Start_Year.findFirst();
    if (!vehicleProductionStartYear) {
      throw new ApiError('Vehicle production start year not found', 404);
    }
    return prisma.vehicle_Production_Start_Year.update({
      where: { start_year: vehicleProductionStartYear.start_year },
      data: { start_year: startYear },
    });
  }

  async getAllVehicleDetails() {
    const vehicleDetail: {
      vehicleColor: VehicleDetail[];
      vehicleClass: VehicleDetail[];
      vehicleTypes: VehicleDetail[];
      vehicleName: VehicleDetail[];
      start_year: number;
    } = {
      vehicleColor: await prisma.vehicle_Color.findMany(),
      vehicleClass: await prisma.vehicle_Class.findMany(),
      vehicleTypes: await prisma.vehicle_Type.findMany(),
      vehicleName: await prisma.vehicle_Name.findMany(),
      start_year: (await prisma.vehicle_Production_Start_Year.findFirst())!
        .start_year,
    };

    return vehicleDetail;
  }
}

const vehicleDetailsService = new VehicleDetailsService();
export default vehicleDetailsService;
