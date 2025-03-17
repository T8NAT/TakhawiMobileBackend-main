"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const client_2 = __importDefault(require("../../prisma/client"));
const driverDocuments_1 = require("../enum/driverDocuments");
const roles_1 = require("../enum/roles");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const userService_1 = __importDefault(require("./userService"));
const userStatus_1 = require("../enum/userStatus");
class DriverService {
    async getNearestDrivers(location, gender, d) {
        const drivers = await client_2.default.$queryRaw `
      SELECT *
      FROM (
        SELECT u.id, u.name, u.phone, u.location, u.avatar,uuid, u.prefered_language, ARRAY_AGG(uft.token) AS tokens,
          2 * 6371 * asin(
            sqrt(
              (sin(radians((CAST(location->>'lat' AS FLOAT) - ${location.lat}) / 2))) ^ 2
              + cos(radians(${location.lat})) * cos(radians(CAST(location->>'lat' AS FLOAT)))
              * (sin(radians((CAST(location->>'lng' AS FLOAT) - ${location.lng}) / 2))) ^ 2
            )
          ) as distance
        FROM "User" u
        LEFT JOIN "User_FCM_Token" uft ON u.id = uft."userId"
        WHERE gender = ${gender}
          AND role = ${roles_1.Roles.DRIVER}
          AND "deletedAt" IS NULL
        GROUP BY u.id, u.name, u.phone, u.location, u.avatar, u.uuid, u.prefered_language
      ) AS subquery
      WHERE distance < ${client_1.Prisma.raw(d.toString())}
      ORDER BY distance
    `;
        return drivers;
    }
    async uploadNationalID(userId, national_id, role, files) {
        await this.checkImageExists(userId, driverDocuments_1.NationalIDImages.FRONT, driverDocuments_1.NationalIDImages.BACK);
        await userService_1.default.updateProfile(userId, { national_id }); // Update national_id in user table
        const images = this.prepareDocuments(files, userId);
        await client_2.default.user_Documents.createMany({
            data: images,
        });
        if (role === roles_1.Roles.USER) {
            // TODO: profile complete should be increased
            await client_2.default.user.update({
                where: {
                    id: userId,
                },
                data: {
                    passenger_status: userStatus_1.UserStatus.PENDING,
                },
            });
        }
    }
    async uploadDriverLicense(userId, files) {
        await this.checkImageExists(userId, driverDocuments_1.DrivingLicenceImages.FRONT, driverDocuments_1.DrivingLicenceImages.BACK);
        const images = this.prepareDocuments(files, userId);
        await client_2.default.user_Documents.createMany({
            data: images,
        });
    }
    async checkUploadStatus(temp_id) {
        const uploads = {
            Vehicle_Images: false,
            Vehicle_Licence: false,
            Insurance_Image: false,
            National_Id_Images: false,
            Driving_Licence_Images: false,
            Avatar_Image: false,
            Vehicle_Exist: false,
        };
        const [vehicleImagesCount, vehicleLicenceCount, insuranceExists, nationalIdImagesCount, drivingLicenceImagesCount, avatarImage, vehicleExist,] = await Promise.all([
            client_2.default.vehicle_Image.count({
                where: {
                    temp_id,
                },
            }),
            client_2.default.vehicle_Licence.count({
                where: {
                    temp_id,
                },
            }),
            client_2.default.vehicle_Insurance.findFirst({
                where: {
                    temp_id,
                },
            }),
            client_2.default.user_Documents.count({
                where: {
                    User: {
                        uuid: temp_id,
                    },
                    type: {
                        in: ['Front National ID', 'Back National ID'],
                    },
                    is_exist: true,
                },
            }),
            client_2.default.user_Documents.count({
                where: {
                    User: {
                        uuid: temp_id,
                    },
                    type: {
                        in: ['Front Driving Licence', 'Back Driving Licence'],
                    },
                    is_exist: true,
                },
            }),
            client_2.default.user.findFirst({
                where: {
                    uuid: temp_id,
                },
                select: {
                    avatar: true,
                },
            }),
            client_2.default.vehicle.findFirst({
                where: {
                    Owner: {
                        uuid: temp_id,
                    },
                },
            }),
        ]);
        uploads.Vehicle_Images = vehicleImagesCount === DriverService.EXPECTED_COUNTS.VEHICLE_IMAGES;
        uploads.Vehicle_Licence = vehicleLicenceCount === DriverService.EXPECTED_COUNTS.VEHICLE_LICENCE;
        uploads.Insurance_Image = !!insuranceExists;
        uploads.National_Id_Images = nationalIdImagesCount
            === DriverService.EXPECTED_COUNTS.NATIONAL_ID_IMAGES;
        uploads.Driving_Licence_Images = drivingLicenceImagesCount
            === DriverService.EXPECTED_COUNTS.DRIVING_LICENCE_IMAGES;
        uploads.Avatar_Image = !!avatarImage?.avatar;
        uploads.Vehicle_Exist = !!vehicleExist;
        return uploads;
    }
    prepareDocuments(files, userId) {
        const images = [];
        for (const file in files) {
            images.push({
                type: file,
                file_path: files[file][0]
                    .path,
                userId,
                is_exist: true,
            });
        }
        return images;
    }
    async checkImageExists(userId, ...types) {
        await Promise.all(types.map(async (type) => {
            const imageExist = await client_2.default.user_Documents.findFirst({
                where: {
                    type,
                    userId,
                    is_exist: true,
                },
            });
            if (imageExist) {
                throw new ApiError_1.default(`You have already uploaded ${type}`, 400);
            }
        }));
    }
}
DriverService.EXPECTED_COUNTS = {
    VEHICLE_IMAGES: 4,
    VEHICLE_LICENCE: 2,
    NATIONAL_ID_IMAGES: 2,
    DRIVING_LICENCE_IMAGES: 2,
};
const driverService = new DriverService();
exports.default = driverService;
