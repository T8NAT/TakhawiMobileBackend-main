"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = __importDefault(require("../../prisma/client"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const authService_1 = __importDefault(require("./authService"));
const pagination_1 = require("../utils/pagination");
const userStatus_1 = require("../enum/userStatus");
const roles_1 = require("../enum/roles");
class UserService {
    async create(data) {
        const { hobbies, ...rest } = data;
        const checkPhoneExist = await authService_1.default.checkUserExist('phone', data.phone);
        if (checkPhoneExist) {
            throw new ApiError_1.default('Phone already exists', 400);
        }
        const checkEmailExist = await authService_1.default.checkUserExist('email', data.email);
        if (checkEmailExist) {
            throw new ApiError_1.default('Email already exists', 400);
        }
        if (data.national_id) {
            const checkNationalIdExist = await authService_1.default.checkUserExist('national_id', data.national_id);
            if (checkNationalIdExist) {
                throw new ApiError_1.default('National ID already exists', 400);
            }
        }
        const { password, ...user } = await client_1.default.user.create({
            data: {
                ...rest,
                password: await bcrypt_1.default.hash(data.password, 10),
                birth_date: data.birth_date ? new Date(data.birth_date) : undefined,
                cityId: data.cityId ? +data.cityId : undefined,
                Hobbies: data.hobbies
                    ? {
                        connect: data.hobbies.map((id) => ({ id: +id })),
                    }
                    : undefined,
            },
        });
        if (data.hobbies) {
            await client_1.default.user.update({
                where: { id: user.id },
                data: {
                    profile_complted: { increment: 25 },
                },
            });
        }
        return user;
    }
    async getAll(queryString) {
        let userActivityStatus;
        switch (queryString.user_activity_status) {
            case userStatus_1.UserActivityStatus.ACTIVE:
                userActivityStatus = null;
                break;
            case userStatus_1.UserActivityStatus.DELETED:
                userActivityStatus = { not: null };
                break;
            case userStatus_1.UserActivityStatus.ALL:
                userActivityStatus = undefined;
                break;
            default:
                userActivityStatus = null; // default active users
        }
        return (0, pagination_1.paginate)('user', {
            where: {
                deletedAt: userActivityStatus,
                passenger_status: queryString.passenger_status,
                driver_status: queryString.driver_status,
                wasl_registration_status: queryString.wasl_registration_status,
                role: queryString.role,
            },
            include: {
                User_Documents: true,
            },
        }, queryString.page, queryString.limit);
    }
    async getDrivers(queryString) {
        return (0, pagination_1.paginate)('user', {
            where: {
                OR: [
                    {
                        role: roles_1.Roles.DRIVER,
                    },
                    {
                        switch_to_driver: true,
                    },
                ],
            },
            include: {
                User_Documents: true,
            },
        }, queryString.page, queryString.limit);
    }
    async getOne(id) {
        const user = await client_1.default.user.findUnique({
            where: { id },
            include: {
                Complaints: true,
                User_Documents: true,
                Vehicles: {
                    include: {
                        Vehicle_Image: true,
                        Vehicle_Licence: true,
                        Insurance_Image: true,
                        Vehicle_Class: true,
                        Vehicle_Color: true,
                        Vehicle_Name: true,
                        Vehicle_Type: true,
                    },
                },
            },
        });
        if (!user) {
            throw new ApiError_1.default('User not found', 404);
        }
        return user;
    }
    async getProfile(id) {
        const user = await client_1.default.user.findUnique({
            where: { id },
            select: {
                id: true,
                avatar: true,
                name: true,
                email: true,
                phone: true,
                birth_date: true,
                gender: true,
                bio: true,
                prefered_language: true,
                City: true,
                Hobbies: true,
                profile_complted: true,
                driver_rate: true,
                passenger_rate: true,
                role: true,
                driver_status: true,
                passenger_status: true,
                switch_to_driver: true,
                phone_verified: true,
                Vehicles: {
                    where: {
                        deletedAt: null,
                    },
                    include: {
                        Vehicle_Class: true,
                        Vehicle_Color: true,
                        Vehicle_Name: true,
                        Vehicle_Type: true,
                        Vehicle_Licence: true,
                    },
                    take: 1,
                },
            },
        });
        if (!user) {
            throw new ApiError_1.default('User not found', 404);
        }
        return user;
    }
    async updateProfile(id, data) {
        const { hobbies, ...rest } = data;
        if (data.national_id) {
            const checkNationalIdExist = await client_1.default.user.findFirst({
                where: { national_id: data.national_id },
            });
            if (checkNationalIdExist && checkNationalIdExist.id !== id) {
                throw new ApiError_1.default('National ID already exists', 400);
            }
        }
        if (data.phone) {
            const checkPhoneExist = await client_1.default.user.findUnique({
                where: { phone: data.phone },
            });
            if (checkPhoneExist && checkPhoneExist.id !== id) {
                throw new ApiError_1.default('Phone already exists', 400);
            }
        }
        if (data.email) {
            const checkEmailExist = await client_1.default.user.findUnique({
                where: { email: data.email },
            });
            if (checkEmailExist && checkEmailExist.id !== id) {
                throw new ApiError_1.default('Email already exists', 400);
            }
        }
        const updatedUser = await client_1.default.user.update({
            where: { id },
            data: {
                ...rest,
                cityId: data.cityId ? +data.cityId : undefined,
                birth_date: data.birth_date ? new Date(data.birth_date) : undefined,
                Hobbies: data.hobbies
                    ? {
                        set: [],
                        connect: data.hobbies.map((id) => ({ id: +id })),
                    }
                    : undefined,
            },
            select: {
                id: true,
                avatar: true,
                name: true,
                email: true,
                phone: true,
                profile_complted: true,
                birth_date: true,
                gender: true,
                bio: true,
                prefered_language: true,
                City: true,
                Hobbies: true,
            },
        });
        if (data.hobbies && updatedUser.profile_complted < 75) {
            await client_1.default.user.update({
                where: { id },
                data: {
                    profile_complted: { increment: 25 },
                },
            });
        }
        return updatedUser;
    }
    async deleteProfile(id) {
        await this.getProfile(id);
        await client_1.default.user.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
    async getUserById(id) {
        const user = await client_1.default.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new ApiError_1.default('User not found', 404);
        }
        return user;
    }
}
const userService = new UserService();
exports.default = userService;
