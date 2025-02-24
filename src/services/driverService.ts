import { Prisma } from '@prisma/client';
import prisma from '../../prisma/client';
import {
  NationalIDImages,
  DrivingLicenceImages,
} from '../enum/driverDocuments';
import { Roles } from '../enum/roles';
import { IDriverService } from '../interfaces/driverService';
import { CheckImageUploadStatus, UploadDocuments } from '../types/driverType';
import { Location, NearestDrivers } from '../types/userType';
import ApiError from '../utils/ApiError';
import userService from './userService';
import { UserStatus } from '../enum/userStatus';

class DriverService implements IDriverService {
  async getNearestDrivers(
    location: Location,
    gender: string,
    d: number,
  ): Promise<NearestDrivers[]> {
    const drivers = await prisma.$queryRaw`
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
          AND role = ${Roles.DRIVER}
          AND "deletedAt" IS NULL
        GROUP BY u.id, u.name, u.phone, u.location, u.avatar, u.uuid, u.prefered_language
      ) AS subquery
      WHERE distance < ${Prisma.raw(d.toString())}
      ORDER BY distance
    `;
    return drivers as NearestDrivers[];
  }

  async uploadNationalID(
    userId: number,
    national_id: string,
    role: string,
    files: Express.Request['files'],
  ): Promise<void> {
    await this.checkImageExists(
      userId,
      NationalIDImages.FRONT,
      NationalIDImages.BACK,
    );

    await userService.updateProfile(userId, { national_id }); // Update national_id in user table

    const images = this.prepareDocuments(files, userId);

    await prisma.user_Documents.createMany({
      data: images,
    });

    if (role === Roles.USER) {
      // TODO: profile complete should be increased
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          passenger_status: UserStatus.PENDING,
        },
      });
    }
  }

  async uploadDriverLicense(
    userId: number,
    files: Express.Request['files'],
  ): Promise<void> {
    await this.checkImageExists(
      userId,
      DrivingLicenceImages.FRONT,
      DrivingLicenceImages.BACK,
    );
    const images = this.prepareDocuments(files, userId);
    await prisma.user_Documents.createMany({
      data: images,
    });
  }

  async checkUploadStatus(temp_id: string): Promise<CheckImageUploadStatus> {
    const uploads: CheckImageUploadStatus = {
      Vehicle_Images: false,
      Vehicle_Licence: false,
      Insurance_Image: false,
      National_Id_Images: false,
      Driving_Licence_Images: false,
      Avatar_Image: false,
      Vehicle_Exist: false,
    };

    const [
      vehicleImagesCount,
      vehicleLicenceCount,
      insuranceExists,
      nationalIdImagesCount,
      drivingLicenceImagesCount,
      avatarImage,
      vehicleExist,
    ] = await Promise.all([
      prisma.vehicle_Image.count({
        where: {
          temp_id,
        },
      }),
      prisma.vehicle_Licence.count({
        where: {
          temp_id,
        },
      }),
      prisma.vehicle_Insurance.findFirst({
        where: {
          temp_id,
        },
      }),
      prisma.user_Documents.count({
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
      prisma.user_Documents.count({
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
      prisma.user.findFirst({
        where: {
          uuid: temp_id,
        },
        select: {
          avatar: true,
        },
      }),
      prisma.vehicle.findFirst({
        where: {
          Owner: {
            uuid: temp_id,
          },
        },
      }),
    ]);

    uploads.Vehicle_Images =
      vehicleImagesCount === DriverService.EXPECTED_COUNTS.VEHICLE_IMAGES;
    uploads.Vehicle_Licence =
      vehicleLicenceCount === DriverService.EXPECTED_COUNTS.VEHICLE_LICENCE;
    uploads.Insurance_Image = !!insuranceExists;
    uploads.National_Id_Images =
      nationalIdImagesCount ===
      DriverService.EXPECTED_COUNTS.NATIONAL_ID_IMAGES;
    uploads.Driving_Licence_Images =
      drivingLicenceImagesCount ===
      DriverService.EXPECTED_COUNTS.DRIVING_LICENCE_IMAGES;
    uploads.Avatar_Image = !!avatarImage?.avatar;
    uploads.Vehicle_Exist = !!vehicleExist;
    return uploads;
  }

  private static EXPECTED_COUNTS = {
    VEHICLE_IMAGES: 4,
    VEHICLE_LICENCE: 2,
    NATIONAL_ID_IMAGES: 2,
    DRIVING_LICENCE_IMAGES: 2,
  };

  private prepareDocuments(
    files: Express.Request['files'],
    userId: number,
  ): UploadDocuments[] {
    const images: UploadDocuments[] = [];
    for (const file in files) {
      images.push({
        type: file,
        file_path: (files as { [file: string]: Express.Multer.File[] })[file][0]
          .path,
        userId,
        is_exist: true,
      });
    }
    return images;
  }

  private async checkImageExists(
    userId: number,
    ...types: string[]
  ): Promise<void> {
    await Promise.all(
      types.map(async (type) => {
        const imageExist = await prisma.user_Documents.findFirst({
          where: {
            type,
            userId,
            is_exist: true,
          },
        });

        if (imageExist) {
          throw new ApiError(`You have already uploaded ${type}`, 400);
        }
      }),
    );
  }
}

const driverService = new DriverService();
export default driverService;
