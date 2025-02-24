import { Prisma } from '@prisma/client';
import moment from 'moment';
import { IVehicleService } from '../interfaces/vehicleService';
import {
  Vehicle,
  CreateVehicle,
  UpdateVehicle,
  VehicleQueryType,
  VehicleImage,
  CreateVehicleImage,
  OrphanedUpload,
} from '../types/vehicleType';
import prisma from '../../prisma/client';
import ApiError from '../utils/ApiError';
import { PaginateType } from '../types/paginateType';
import { paginate } from '../utils/pagination';
import { UserStatus } from '../enum/userStatus';
import { VehicleImageType } from '../enum/vehicle';
import { FileMap } from '../types/files';
import { removeFile } from '../utils/fileHandler';

class VehicleService implements IVehicleService {
  async create(data: CreateVehicle, temp_id: string): Promise<Vehicle> {
    const existingVehicle = await this.existingVehicleCheck(data.driverId);
    if (existingVehicle) {
      throw new ApiError('Driver already has a vehicle', 400);
    }

    return prisma.$transaction(async (tx) => {
      const vehicle = await tx.vehicle.create({
        data: {
          ...data,
          driverId: data.driverId,
        },
      });

      await this.updateVehicleImagesAndInsurance(tx, temp_id, vehicle.id);

      // Update driver status to pending after vehicle creation to wait for admin approval
      await tx.user.update({
        where: {
          id: data.driverId,
        },
        data: {
          driver_status: UserStatus.PENDING,
        },
      });

      return vehicle;
    });
  }

  async getAll(queryString: VehicleQueryType): Promise<PaginateType<Vehicle>> {
    const { page, limit, production_year, seats_no } = queryString;

    const filterOptions = {
      deletedAt: null,
      production_year: production_year ? +production_year : undefined,
      seats_no: seats_no ? +seats_no : undefined,
    };

    return paginate('vehicle', { where: filterOptions }, page, limit);
  }

  async getOne(vehicleId: number, driverId?: number): Promise<Vehicle> {
    const vehicle = await prisma.vehicle.findUnique({
      where: {
        id: vehicleId,
        driverId,
        deletedAt: null,
      },
      include: {
        Vehicle_Color: true,
        Vehicle_Class: true,
        Vehicle_Type: true,
        Vehicle_Name: true,
      },
    });
    if (!vehicle) {
      throw new ApiError('Vehicle not found', 404);
    }
    return vehicle;
  }

  async update(
    data: UpdateVehicle,
    vehicleId: number,
    driverId?: number,
  ): Promise<Vehicle> {
    await this.getOne(vehicleId, driverId);
    const vehicle = await prisma.vehicle.update({
      where: {
        id: vehicleId,
      },
      data,
    });

    return vehicle;
  }

  async delete(vehicleId: number, driverId?: number): Promise<void> {
    await this.getOne(vehicleId, driverId);
    await prisma.vehicle.update({
      where: {
        id: vehicleId,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async uploadVehicleLicence(
    temp_id: string,
    files: Express.Multer.File[],
  ): Promise<{ count: number }> {
    const images = files.map((file) => ({
      temp_id,
      file_path: file.path,
    }));

    const vehicleLicenceImagesExist = await prisma.vehicle_Licence.findMany({
      where: {
        temp_id,
      },
    });
    if (vehicleLicenceImagesExist.length) {
      throw new ApiError('Licence already uploaded', 400);
    }

    return prisma.vehicle_Licence.createMany({
      data: images,
    });
  }

  async uploadVehicleImages(
    temp_id: string,
    files: Express.Multer.File[],
  ): Promise<{ count: number }> {
    const images = files.map((file) => ({
      temp_id,
      file_path: file.path,
    }));

    const vehicleImagesExist = await prisma.vehicle_Image.findMany({
      where: {
        temp_id,
      },
    });

    if (vehicleImagesExist.length) {
      throw new ApiError('Images already uploaded', 400);
    }

    return prisma.vehicle_Image.createMany({
      data: images,
    });
  }

  async uploadVehicleInsurance(
    temp_id: string,
    file_path: string,
  ): Promise<VehicleImage> {
    const insuranceExist = await prisma.vehicle_Insurance.findFirst({
      where: {
        temp_id,
      },
    });
    if (insuranceExist) {
      throw new ApiError('Insurance already uploaded', 400);
    }

    return prisma.vehicle_Insurance.create({
      data: {
        temp_id,
        file_path,
      },
    });
  }

  async addNewVehicle(data: CreateVehicle, files: FileMap): Promise<Vehicle> {
    const existingVehicle = await this.existingVehicleCheck(data.driverId);
    if (existingVehicle) {
      throw new ApiError('Driver already has a vehicle', 400);
    }

    const insuranceImages: CreateVehicleImage[] = [];
    const vehicleImages: CreateVehicleImage[] = [];
    const vehicleLicenceImages: CreateVehicleImage[] = [];

    for (const key in files) {
      if (key === VehicleImageType.INSURANCE) {
        files[key].forEach((file: Express.Multer.File) => {
          insuranceImages.push({
            file_path: file.path,
          });
        });
      }
      if (key === VehicleImageType.LICENCE) {
        files[key].forEach((file: Express.Multer.File) => {
          vehicleLicenceImages.push({
            file_path: file.path,
          });
        });
      }
      if (key === VehicleImageType.VEHICLE) {
        files[key].forEach((file: Express.Multer.File) => {
          vehicleImages.push({
            file_path: file.path,
          });
        });
      }
    }

    return prisma.vehicle.create({
      data: {
        production_year: +data.production_year,
        seats_no: +data.seats_no,
        driverId: +data.driverId,
        vehicle_class_id: +data.vehicle_class_id,
        vehicle_color_id: +data.vehicle_color_id,
        vehicle_name_id: +data.vehicle_name_id,
        vehicle_type_id: +data.vehicle_type_id,
        plate_number: data.plate_number,
        plate_alphabet: data.plate_alphabet,
        plate_alphabet_ar: data.plate_alphabet_ar,
        serial_no: data.serial_no,
        Insurance_Image: {
          create: {
            file_path: insuranceImages[0].file_path,
          },
        },
        Vehicle_Image: {
          createMany: {
            data: vehicleImages,
          },
        },
        Vehicle_Licence: {
          createMany: {
            data: vehicleLicenceImages,
          },
        },
      },
    });
  }

  async cleanupOrphanUploads(): Promise<void> {
    const oneDayAgo = moment().subtract(1, 'days').toDate();
    const orphanedUploads: OrphanedUpload[] = await prisma.$queryRaw`
    SELECT 'Vehicle_Image' AS model, id, file_path FROM "Vehicle_Image" WHERE vehicle_id IS NULL AND "createdAt" < ${oneDayAgo}
    UNION ALL
    SELECT 'Vehicle_Insurance' AS model, id, file_path FROM "Vehicle_Insurance" WHERE vehicle_id IS NULL AND "createdAt" < ${oneDayAgo}
    UNION ALL
    SELECT 'Vehicle_Licence' AS model, id, file_path FROM "Vehicle_Licence" WHERE vehicle_id IS NULL AND "createdAt" < ${oneDayAgo};
  `;
    await Promise.all(
      orphanedUploads.map(async (upload: OrphanedUpload) => {
        removeFile(upload.file_path);
        await prisma.$executeRaw`DELETE FROM "${Prisma.raw(upload.model)}" WHERE id = ${upload.id}`;
      }),
    );
  }

  private async updateVehicleImagesAndInsurance(
    tx: Prisma.TransactionClient,
    temp_id: string,
    vehicle_id: number,
  ): Promise<void> {
    await Promise.all([
      tx.vehicle_Image.updateMany({
        where: { temp_id },
        data: {
          vehicle_id,
          temp_id: null,
        },
      }),

      tx.vehicle_Insurance.updateMany({
        where: { temp_id },
        data: {
          vehicle_id,
          temp_id: null,
        },
      }),

      tx.vehicle_Licence.updateMany({
        where: { temp_id },
        data: {
          vehicle_id,
          temp_id: null,
        },
      }),
    ]);
  }

  private async existingVehicleCheck(
    driverId: number,
  ): Promise<Vehicle | null> {
    return prisma.vehicle.findFirst({
      where: {
        driverId,
        deletedAt: null,
      },
    });
  }
}

const vehicleService = new VehicleService();
export default vehicleService;
