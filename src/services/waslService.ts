import axios, { AxiosError } from 'axios';
import { formatDateToHijriAndGregorian } from '../utils/dateFormatter';
import ApiError from '../utils/ApiError';
import prisma from '../../prisma/client';
import { waslRegistrationStatus, WaslResultCode } from '../enum/wasl';
import { UserStatus } from '../enum/userStatus';
import {
  CreateWaslTrip,
  CreateWaslTripLog,
  WaslTripLog,
  WaslTripLogQueryType,
} from '../types/waslType';
import { PaginateType } from '../types/paginateType';
import { paginate } from '../utils/pagination';
import sendPushNotification from '../utils/pushNotification';

class WaslService {
  private static readonly ENDPOINT =
    'https://wasl.api.elm.sa/api/dispatching/v2';

  private static readonly HEADERS = {
    'Content-Type': 'application/json',
    'client-id': process.env.WASL_CLIENT_ID!,
    'app-id': process.env.WASL_APP_ID!,
    'app-key': process.env.WASL_APP_KEY!,
  };

  async createDriverandVehicleRegistration(userId: number) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
        driver_status: UserStatus.APPROVED,
      },
      include: {
        Vehicles: {
          where: {
            deletedAt: null,
          },
        },
        User_FCM_Tokens: true,
      },
    });
    if (!user || user.Vehicles.length === 0) {
      throw new ApiError('User not found', 404);
    }

    const hijri = formatDateToHijriAndGregorian(user.birth_date!);
    const vehicle = user.Vehicles[0];
    const { plateLetterLeft, plateLetterMiddle, plateLetterRight } =
      this.returnPlateLetter(vehicle.plate_alphabet_ar);
    const tokens = user.User_FCM_Tokens.map((token) => token.token);

    const body = {
      driver: {
        identityNumber: user.national_id,
        dateOfBirthHijri: hijri,
        dateOfBirthGregorian: user.birth_date!.toISOString().split('T')[0],
        emailAddress: user.email,
        mobileNumber: `+966${user.phone}`,
      },
      vehicle: {
        sequenceNumber: vehicle.serial_no,
        plateLetterRight,
        plateLetterMiddle,
        plateLetterLeft,
        plateNumber: vehicle.plate_number,
        plateType: '1',
      },
    };

    try {
      const response = await axios.post(
        `${WaslService.ENDPOINT}/drivers`,
        body,
        { headers: WaslService.HEADERS },
      );

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          wasl_registration_status: response.data.result.eligibility,
        },
      });

      if (tokens.length > 0) {
        sendPushNotification({
          title: 'Welcome to Wasl',
          body: `Your request to register with Wasl has been successful. your eligibility status is ${response.data.result.eligibility}.`,
          tokens,
        });
      }

      return response.data;
    } catch (error) {
      const title = 'Wasl Registration Failed';
      const body =
        'Your registration with Wasl has failed. Please try again later.';

      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;
        const httpStatusCode = this.mapResultCodeToHttpStatus(
          responseData.resultCode,
        );
        if (responseData.resultCode === WaslResultCode.BAD_REQUEST) {
          if (tokens.length > 0) {
            sendPushNotification({
              title,
              body: responseData.resultMsg
                ? `${responseData.resultMsg} Please try again later.`
                : body,
              tokens,
            });
          }
          throw new ApiError(
            `Bad Request: ${responseData.resultMsg} `,
            httpStatusCode,
          );
        } else {
          if (tokens.length > 0) {
            sendPushNotification({
              title,
              body: responseData.resultCode
                ? `${responseData.resultCode} Please try again later.`
                : body,
              tokens,
            });
          }
          throw new ApiError(
            `Error: ${responseData.resultCode}`,
            httpStatusCode,
          );
        }
      } else {
        if (tokens.length > 0) {
          sendPushNotification({
            title,
            body,
            tokens,
          });
        }
        throw new ApiError(
          `${(error as AxiosError).message}`,
          (error as AxiosError).response?.status ?? 500,
        );
      }
    }
  }

  async getDriverandVehicleRegistration(userId: number) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
        driver_status: UserStatus.APPROVED,
      },
      include: {
        Vehicles: {
          where: {
            deletedAt: null,
          },
        },
      },
    });
    if (
      !user ||
      user.wasl_registration_status === waslRegistrationStatus.NOT_REGISTERED
    )
      throw new ApiError('User not registered with Wasl', 404);

    try {
      const response = await axios.get(
        `${WaslService.ENDPOINT}/drivers/eligibility/${user.national_id}`,
        { headers: WaslService.HEADERS },
      );

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          wasl_registration_status: response.data.driverEligibility,
        },
      });
      return response.data;
    } catch (error) {
      const err = error as AxiosError;
      if (err.status === 400) {
        throw new ApiError('Bad Request: invalid driver identity number', 400);
      }
      throw new ApiError(`${err.message}`, err.status ?? 500);
    }
  }

  async createTripRegistration(body: CreateWaslTrip) {
    try {
      const response = await axios.post(`${WaslService.ENDPOINT}/trips`, body, {
        headers: WaslService.HEADERS,
      });
      return response.data;
    } catch (error) {
      // Use tripLog this to handle server errors
      const tripLog: CreateWaslTripLog = {
        result_code: WaslResultCode.CONTACT_WASL_SUPPORT,
        status: false,
        result_msg: 'Contact Wasl Support',
        trip_id: body.tripId,
      };
      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;
        const data: CreateWaslTripLog = {
          result_code: responseData.resultCode,
          status: responseData.success,
          result_msg: responseData.resultMsg,
          trip_id: body.tripId,
        };
        if (error.status === 500) {
          return await this.createTripLog(tripLog);
        }
        return await this.createTripLog(data);
      }
      return await this.createTripLog(tripLog);
    }
  }

  async createTripLog(data: CreateWaslTripLog): Promise<WaslTripLog> {
    const trip = await prisma.trip.findUnique({ where: { id: data.trip_id } });
    if (!trip) throw new ApiError('Trip not found', 404);
    return prisma.wasl_trip_log.create({
      data,
    });
  }

  async getTripsLog(
    queryString: WaslTripLogQueryType,
  ): Promise<PaginateType<WaslTripLog>> {
    return paginate('wasl_trip_log', {}, queryString.page, queryString.limit);
  }

  mapResultCodeToHttpStatus(resultCode: string): number {
    const statusMapping = {
      [WaslResultCode.BAD_REQUEST]: 400,
      [WaslResultCode.DRIVER_VEHICLE_DUPLICATE]: 409,
      [WaslResultCode.DRIVER_NOT_ALLOWED]: 403,
      [WaslResultCode.DRIVER_NOT_FOUND]: 404,
      [WaslResultCode.VEHICLE_NOT_FOUND]: 404,
      [WaslResultCode.VEHICLE_NOT_OWNED_BY_FINANCIER]: 422,
      [WaslResultCode.DRIVER_NOT_AUTHORIZED_TO_DRIVE_VEHICLE]: 403,
      [WaslResultCode.NO_VALID_OPERATION_CARD]: 422,
      [WaslResultCode.CONTACT_WASL_SUPPORT]: 500,
      [WaslResultCode.NO_OPERATIONAL_CARD_FOUND]: 422,
    } as Record<string, number>;

    return statusMapping[resultCode] || 500;
  }

  returnPlateLetter(plate: string) {
    plate = plate.replace(/ي/g, 'ی');
    const plateLetterLeft = plate.substring(2, 3);
    const plateLetterMiddle = plate.substring(1, 2);
    const plateLetterRight = plate.substring(0, 1);
    return {
      plateLetterLeft,
      plateLetterMiddle,
      plateLetterRight,
    };
  }
}

const waslService = new WaslService();
export default waslService;
