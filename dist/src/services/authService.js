"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = __importDefault(require("../../prisma/client"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const signToken_1 = require("../utils/signToken");
const msegatService_1 = __importDefault(require("./msegatService"));
class AuthService {
    async checkUserExist(field, value) {
        const user = await client_1.default.user.findFirst({
            where: {
                [field]: value,
            },
        });
        return !!user;
    }
    async signUp(data) {
        const { password, cityId } = data;
        const checkPhoneExist = await this.checkUserExist('phone', data.phone);
        if (checkPhoneExist) {
            throw new ApiError_1.default('Phone already exists', 400);
        }
        const checkEmailExist = await this.checkUserExist('email', data.email);
        if (checkEmailExist) {
            throw new ApiError_1.default('Email already exists', 400);
        }
        if (data.national_id) {
            const checkNationalIdExist = await this.checkUserExist('national_id', data.national_id);
            if (checkNationalIdExist) {
                throw new ApiError_1.default('National ID already exists', 400);
            }
        }
        const user = await client_1.default.user.create({
            data: {
                ...data,
                cityId: cityId ? +cityId : undefined,
                password: await bcrypt_1.default.hash(password, 10),
            },
        });
        const { accessToken, refreshToken } = (0, signToken_1.generateTokens)(user);
        const { password: removedPassowrd, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, accessToken, refreshToken };
    }
    async login(data) {
        const { phone, password } = data;
        const user = await client_1.default.user.findUnique({
            where: {
                phone,
            },
            include: {
                City: true,
                Vehicles: {
                    where: {
                        deletedAt: null,
                    },
                    take: 1,
                },
            },
        });
        if (!user) {
            throw new ApiError_1.default('Phone or password is incorrect', 400);
        }
        const passwordMatch = await bcrypt_1.default.compare(password, user.password);
        if (!passwordMatch) {
            throw new ApiError_1.default('Phone or password is incorrect', 400);
        }
        if (user.is_blocked === true || user.deletedAt) {
            throw new ApiError_1.default('Your account is either blocked or deleted. If you believe this is a mistake, please contact our support team for assistance.', 403);
        }
        const { password: removedPassowrd, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    async forgetPassword(phone) {
        const user = await client_1.default.user.findUnique({
            where: {
                phone,
            },
        });
        if (!user) {
            throw new ApiError_1.default('User not found', 404);
        }
        const otp = await msegatService_1.default.sendOTP(phone, user.prefered_language);
        if (otp.code === 1) {
            await client_1.default.user_Code.upsert({
                where: {
                    userId: user.id,
                },
                update: {
                    reset_password_code: otp.id.toString(),
                    reset_password_expire_date: new Date(Date.now() + 10 * 60 * 1000),
                },
                create: {
                    userId: user.id,
                    reset_password_code: otp.id.toString(),
                    reset_password_expire_date: new Date(Date.now() + 10 * 60 * 1000),
                },
            });
        }
    }
    async verifyResetPasswordCode(data) {
        const { phone, code } = data;
        const userCode = await client_1.default.user_Code.findFirst({
            where: {
                reset_password_expire_date: {
                    gte: new Date(),
                },
                User: {
                    phone,
                },
            },
            select: {
                reset_password_code: true,
                User: {
                    select: {
                        phone: true,
                        prefered_language: true,
                    },
                },
            },
        });
        if (!userCode) {
            throw new ApiError_1.default('Code is Invalid Or Expired', 400);
        }
        const verifyOTP = await msegatService_1.default.verifyOTP({
            lang: userCode.User.prefered_language,
            code,
            id: userCode.reset_password_code,
        });
        if (verifyOTP.code !== 1) {
            throw new ApiError_1.default('Code is Invalid Or Expired', 400);
        }
    }
    async resetPassword(data) {
        const { phone, password } = data;
        const userCode = await client_1.default.user_Code.findFirst({
            where: {
                reset_password_expire_date: {
                    gte: new Date(),
                },
                User: {
                    phone,
                },
            },
        });
        if (!userCode) {
            throw new ApiError_1.default('Code is Expired', 400);
        }
        await client_1.default.user.update({
            where: {
                phone,
            },
            data: {
                password: await bcrypt_1.default.hash(password, 10),
            },
        });
    }
    async changePassword(userId, passwords) {
        const { oldPassword, newPassword } = passwords;
        const user = await client_1.default.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user) {
            throw new ApiError_1.default('User not found', 404);
        }
        const passwordMatch = await bcrypt_1.default.compare(oldPassword, user.password);
        if (!passwordMatch) {
            throw new ApiError_1.default('Old password is incorrect', 400);
        }
        await client_1.default.user.update({
            where: {
                id: userId,
            },
            data: {
                password: await bcrypt_1.default.hash(newPassword, 10),
            },
        });
    }
    async sendVerificationCode(userId) {
        const user = await client_1.default.user.findFirst({
            where: { id: userId, phone_verified: false },
        });
        if (!user) {
            throw new ApiError_1.default('User not found', 404);
        }
        const otp = await msegatService_1.default.sendOTP(user.phone, user.prefered_language);
        if (otp.code === 1) {
            await client_1.default.user_Code.upsert({
                where: {
                    userId: user.id,
                },
                update: {
                    phone_verify_code: otp.id.toString(),
                    phone_expire_date: new Date(Date.now() + 10 * 60 * 1000),
                },
                create: {
                    userId: user.id,
                    phone_verify_code: otp.id.toString(),
                    phone_expire_date: new Date(Date.now() + 10 * 60 * 1000),
                },
            });
        }
    }
    async verifyPhoneCode(userId, code) {
        const userCode = await client_1.default.user_Code.findFirst({
            where: {
                phone_expire_date: {
                    gte: new Date(),
                },
                userId,
            },
            include: {
                User: {
                    select: {
                        prefered_language: true,
                    },
                },
            },
        });
        if (!userCode) {
            throw new ApiError_1.default('Code is Invalid Or Expired', 400);
        }
        const verifyOTP = await msegatService_1.default.verifyOTP({
            lang: userCode.User.prefered_language,
            code,
            id: userCode.phone_verify_code,
        });
        if (verifyOTP.code !== 1) {
            throw new ApiError_1.default('Code is Invalid Or Expired', 400);
        }
        await client_1.default.user.update({
            where: {
                id: userId,
            },
            data: {
                phone_verified: true,
            },
        });
    }
}
const authService = new AuthService();
exports.default = authService;
