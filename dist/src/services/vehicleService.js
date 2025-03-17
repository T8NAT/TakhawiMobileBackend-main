"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const moment_1 = __importDefault(require("moment"));
const client_2 = __importDefault(require("../../prisma/client"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const pagination_1 = require("../utils/pagination");
const userStatus_1 = require("../enum/userStatus");
const vehicle_1 = require("../enum/vehicle");
const fileHandler_1 = require("../utils/fileHandler");
class VehicleService {
    async create(data, temp_id) {
        const existingVehicle = await this.existingVehicleCheck(data.driverId);
        if (existingVehicle) {
            throw new ApiError_1.default('Driver already has a vehicle', 400);
        }
        return client_2.default.$transaction(async (tx) => {
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
                    driver_status: userStatus_1.UserStatus.PENDING,
                },
            });
            return vehicle;
        });
    }
    async getAll(queryString) {
        const { page, limit, production_year, seats_no, } = queryString;
        const filterOptions = {
            deletedAt: null,
            production_year: production_year ? +production_year : undefined,
            seats_no: seats_no ? +seats_no : undefined,
        };
        return (0, pagination_1.paginate)('vehicle', { where: filterOptions }, page, limit);
    }
    async getOne(vehicleId, driverId) {
        const vehicle = await client_2.default.vehicle.findUnique({
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
            throw new ApiError_1.default('Vehicle not found', 404);
        }
        return vehicle;
    }
    async update(data, vehicleId, driverId) {
        await this.getOne(vehicleId, driverId);
        const vehicle = await client_2.default.vehicle.update({
            where: {
                id: vehicleId,
            },
            data,
        });
        return vehicle;
    }
    async delete(vehicleId, driverId) {
        await this.getOne(vehicleId, driverId);
        await client_2.default.vehicle.update({
            where: {
                id: vehicleId,
            },
            data: {
                deletedAt: new Date(),
            },
        });
    }
    async uploadVehicleLicence(temp_id, files) {
        const images = files.map((file) => ({
            temp_id,
            file_path: file.path,
        }));
        const vehicleLicenceImagesExist = await client_2.default.vehicle_Licence.findMany({
            where: {
                temp_id,
            },
        });
        if (vehicleLicenceImagesExist.length) {
            throw new ApiError_1.default('Licence already uploaded', 400);
        }
        return client_2.default.vehicle_Licence.createMany({
            data: images,
        });
    }
    async uploadVehicleImages(temp_id, files) {
        const images = files.map((file) => ({
            temp_id,
            file_path: file.path,
        }));
        const vehicleImagesExist = await client_2.default.vehicle_Image.findMany({
            where: {
                temp_id,
            },
        });
        if (vehicleImagesExist.length) {
            throw new ApiError_1.default('Images already uploaded', 400);
        }
        return client_2.default.vehicle_Image.createMany({
            data: images,
        });
    }
    async uploadVehicleInsurance(temp_id, file_path) {
        const insuranceExist = await client_2.default.vehicle_Insurance.findFirst({
            where: {
                temp_id,
            },
        });
        if (insuranceExist) {
            throw new ApiError_1.default('Insurance already uploaded', 400);
        }
        return client_2.default.vehicle_Insurance.create({
            data: {
                temp_id,
                file_path,
            },
        });
    }
    async addNewVehicle(data, files) {
        const existingVehicle = await this.existingVehicleCheck(data.driverId);
        if (existingVehicle) {
            throw new ApiError_1.default('Driver already has a vehicle', 400);
        }
        const insuranceImages = [];
        const vehicleImages = [];
        const vehicleLicenceImages = [];
        for (const key in files) {
            if (key === vehicle_1.VehicleImageType.INSURANCE) {
                files[key].forEach((file) => {
                    insuranceImages.push({
                        file_path: file.path,
                    });
                });
            }
            if (key === vehicle_1.VehicleImageType.LICENCE) {
                files[key].forEach((file) => {
                    vehicleLicenceImages.push({
                        file_path: file.path,
                    });
                });
            }
            if (key === vehicle_1.VehicleImageType.VEHICLE) {
                files[key].forEach((file) => {
                    vehicleImages.push({
                        file_path: file.path,
                    });
                });
            }
        }
        return client_2.default.vehicle.create({
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
    async cleanupOrphanUploads() {
        const oneDayAgo = (0, moment_1.default)().subtract(1, 'days').toDate();
        const orphanedUploads = await client_2.default.$queryRaw `
    SELECT 'Vehicle_Image' AS model, id, file_path FROM "Vehicle_Image" WHERE vehicle_id IS NULL AND "createdAt" < ${oneDayAgo}
    UNION ALL
    SELECT 'Vehicle_Insurance' AS model, id, file_path FROM "Vehicle_Insurance" WHERE vehicle_id IS NULL AND "createdAt" < ${oneDayAgo}
    UNION ALL
    SELECT 'Vehicle_Licence' AS model, id, file_path FROM "Vehicle_Licence" WHERE vehicle_id IS NULL AND "createdAt" < ${oneDayAgo};
  `;
        await Promise.all(orphanedUploads.map(async (upload) => {
            (0, fileHandler_1.removeFile)(upload.file_path);
            await client_2.default.$executeRaw `DELETE FROM "${client_1.Prisma.raw(upload.model)}" WHERE id = ${upload.id}`;
        }));
    }
    async updateVehicleImagesAndInsurance(tx, temp_id, vehicle_id) {
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
    async existingVehicleCheck(driverId) {
        return client_2.default.vehicle.findFirst({
            where: {
                driverId,
                deletedAt: null,
            },
        });
    }
}
const vehicleService = new VehicleService();
exports.default = vehicleService;
