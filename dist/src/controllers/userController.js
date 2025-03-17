"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_1 = __importDefault(require("../utils/response"));
const userService_1 = __importDefault(require("../services/userService"));
const fileHandler_1 = require("../utils/fileHandler");
const user_serialization_1 = require("../utils/serialization/user.serialization");
const tripService_1 = __importDefault(require("../services/tripService"));
const activeTrip_serialization_1 = require("../utils/serialization/activeTrip.serialization");
class UserContorller {
    async create(req, res, next) {
        try {
            if (req.file) {
                req.body.avatar = req.file.path;
            }
            const user = await userService_1.default.create(req.body);
            (0, response_1.default)(res, 201, {
                status: true,
                message: 'User created successfully',
                result: user,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getAll(req, res, next) {
        try {
            const users = await userService_1.default.getAll(req.query);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Users fetched successfully',
                pagination: users.pagination,
                result: users.data,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getDrivers(req, res, next) {
        try {
            const drivers = await userService_1.default.getDrivers(req.query);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Drivers fetched successfully',
                result: drivers,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getOne(req, res, next) {
        try {
            const user = await userService_1.default.getOne(+req.params.id);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'User fetched successfully',
                result: user,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getProfile(req, res, next) {
        try {
            const { user: userId, language, role } = req;
            const [user, activeTrip] = await Promise.all([
                userService_1.default.getProfile(userId),
                tripService_1.default.getActiveTrip(userId, role),
            ]);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'User fetched successfully',
                result: {
                    ...(0, user_serialization_1.serializeUser)(user, language, role),
                    role,
                    activeTrip: activeTrip
                        ? (0, activeTrip_serialization_1.serializeActiveTrip)(activeTrip, language, role)
                        : null,
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    async updateProfile(req, res, next) {
        try {
            const userId = req.user;
            const existedUser = await userService_1.default.getProfile(userId);
            if (req.file) {
                req.body.avatar = req.file.path;
            }
            const user = await userService_1.default.updateProfile(userId, req.body);
            if (req.file && existedUser.avatar) {
                (0, fileHandler_1.removeFile)(existedUser.avatar);
            }
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'User updated successfully',
                result: user,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async deleteProfile(req, res, next) {
        try {
            const userId = req.user;
            await userService_1.default.deleteProfile(userId);
            (0, response_1.default)(res, 204, {
                status: true,
                message: 'User deleted successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
}
const userController = new UserContorller();
exports.default = userController;
