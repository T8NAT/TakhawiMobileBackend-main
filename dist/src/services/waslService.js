"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const dateFormatter_1 = require("../utils/dateFormatter");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const client_1 = __importDefault(require("../../prisma/client"));
const wasl_1 = require("../enum/wasl");
const userStatus_1 = require("../enum/userStatus");
const pagination_1 = require("../utils/pagination");
const pushNotification_1 = __importDefault(require("../utils/pushNotification"));
class WaslService {
    async createDriverandVehicleRegistration(userId) {
        const user = await client_1.default.user.findUnique({
            where: {
                id: userId,
                driver_status: userStatus_1.UserStatus.APPROVED,
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
            throw new ApiError_1.default('User not found', 404);
        }
        const hijri = (0, dateFormatter_1.formatDateToHijriAndGregorian)(user.birth_date);
        const vehicle = user.Vehicles[0];
        const { plateLetterLeft, plateLetterMiddle, plateLetterRight } = this.returnPlateLetter(vehicle.plate_alphabet_ar);
        const tokens = user.User_FCM_Tokens.map((token) => token.token);
        const body = {
            driver: {
                identityNumber: user.national_id,
                dateOfBirthHijri: hijri,
                dateOfBirthGregorian: user.birth_date.toISOString().split('T')[0],
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
            const response = await axios_1.default.post(`${WaslService.ENDPOINT}/drivers`, body, { headers: WaslService.HEADERS });
            await client_1.default.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    wasl_registration_status: response.data.result.eligibility,
                },
            });
            if (tokens.length > 0) {
                (0, pushNotification_1.default)({
                    title: 'Welcome to Wasl',
                    body: `Your request to register with Wasl has been successful. your eligibility status is ${response.data.result.eligibility}.`,
                    tokens,
                });
            }
            return response.data;
        }
        catch (error) {
            const title = 'Wasl Registration Failed';
            const body = 'Your registration with Wasl has failed. Please try again later.';
            if (axios_1.default.isAxiosError(error)) {
                const responseData = error.response?.data;
                const httpStatusCode = this.mapResultCodeToHttpStatus(responseData.resultCode);
                if (responseData.resultCode === wasl_1.WaslResultCode.BAD_REQUEST) {
                    if (tokens.length > 0) {
                        (0, pushNotification_1.default)({
                            title,
                            body: responseData.resultMsg ? `${responseData.resultMsg} Please try again later.` : body,
                            tokens,
                        });
                    }
                    throw new ApiError_1.default(`Bad Request: ${responseData.resultMsg} `, httpStatusCode);
                }
                else {
                    if (tokens.length > 0) {
                        (0, pushNotification_1.default)({
                            title,
                            body: responseData.resultCode ? `${responseData.resultCode} Please try again later.` : body,
                            tokens,
                        });
                    }
                    throw new ApiError_1.default(`Error: ${responseData.resultCode}`, httpStatusCode);
                }
            }
            else {
                if (tokens.length > 0) {
                    (0, pushNotification_1.default)({
                        title,
                        body,
                        tokens,
                    });
                }
                throw new ApiError_1.default(`${error.message}`, error.response?.status ?? 500);
            }
        }
    }
    async getDriverandVehicleRegistration(userId) {
        const user = await client_1.default.user.findUnique({
            where: {
                id: userId,
                driver_status: userStatus_1.UserStatus.APPROVED,
            },
            include: {
                Vehicles: {
                    where: {
                        deletedAt: null,
                    },
                },
            },
        });
        if (!user || user.wasl_registration_status === wasl_1.waslRegistrationStatus.NOT_REGISTERED)
            throw new ApiError_1.default('User not registered with Wasl', 404);
        try {
            const response = await axios_1.default.get(`${WaslService.ENDPOINT}/drivers/eligibility/${user.national_id}`, { headers: WaslService.HEADERS });
            await client_1.default.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    wasl_registration_status: response.data.driverEligibility,
                },
            });
            return response.data;
        }
        catch (error) {
            const err = error;
            if (err.status === 400) {
                throw new ApiError_1.default('Bad Request: invalid driver identity number', 400);
            }
            throw new ApiError_1.default(`${err.message}`, err.status ?? 500);
        }
    }
    async createTripRegistration(body) {
        try {
            const response = await axios_1.default.post(`${WaslService.ENDPOINT}/trips`, body, { headers: WaslService.HEADERS });
            return response.data;
        }
        catch (error) {
            // Use tripLog this to handle server errors
            const tripLog = {
                result_code: wasl_1.WaslResultCode.CONTACT_WASL_SUPPORT,
                status: false,
                result_msg: 'Contact Wasl Support',
                trip_id: body.tripId,
            };
            if (axios_1.default.isAxiosError(error)) {
                const responseData = error.response?.data;
                const data = {
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
    async createTripLog(data) {
        const trip = await client_1.default.trip.findUnique({ where: { id: data.trip_id } });
        if (!trip)
            throw new ApiError_1.default('Trip not found', 404);
        return client_1.default.wasl_trip_log.create({
            data,
        });
    }
    async getTripsLog(queryString) {
        return (0, pagination_1.paginate)('wasl_trip_log', {}, queryString.page, queryString.limit);
    }
    mapResultCodeToHttpStatus(resultCode) {
        const statusMapping = {
            [wasl_1.WaslResultCode.BAD_REQUEST]: 400,
            [wasl_1.WaslResultCode.DRIVER_VEHICLE_DUPLICATE]: 409,
            [wasl_1.WaslResultCode.DRIVER_NOT_ALLOWED]: 403,
            [wasl_1.WaslResultCode.DRIVER_NOT_FOUND]: 404,
            [wasl_1.WaslResultCode.VEHICLE_NOT_FOUND]: 404,
            [wasl_1.WaslResultCode.VEHICLE_NOT_OWNED_BY_FINANCIER]: 422,
            [wasl_1.WaslResultCode.DRIVER_NOT_AUTHORIZED_TO_DRIVE_VEHICLE]: 403,
            [wasl_1.WaslResultCode.NO_VALID_OPERATION_CARD]: 422,
            [wasl_1.WaslResultCode.CONTACT_WASL_SUPPORT]: 500,
            [wasl_1.WaslResultCode.NO_OPERATIONAL_CARD_FOUND]: 422,
        };
        return statusMapping[resultCode] || 500;
    }
    returnPlateLetter(plate) {
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
WaslService.ENDPOINT = 'https://wasl.api.elm.sa/api/dispatching/v2';
WaslService.HEADERS = {
    'Content-Type': 'application/json',
    'client-id': process.env.WASL_CLIENT_ID,
    'app-id': process.env.WASL_APP_ID,
    'app-key': process.env.WASL_APP_KEY,
};
const waslService = new WaslService();
exports.default = waslService;
