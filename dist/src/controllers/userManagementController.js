"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_1 = __importDefault(require("../utils/response"));
const userManagementService_1 = __importDefault(require("../services/userManagementService"));
const roles_1 = require("../enum/roles");
const userService_1 = __importDefault(require("../services/userService"));
const tripService_1 = __importDefault(require("../services/tripService"));
const user_serialization_1 = require("../utils/serialization/user.serialization");
const activeTrip_serialization_1 = require("../utils/serialization/activeTrip.serialization");
class UserManagementController {
    async updateLocation(req, res, next) {
        try {
            const userId = req.user;
            await userManagementService_1.default.updateLocation(userId, req.body);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Location updated successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
    async updateDriverStatus(req, res, next) {
        try {
            await userManagementService_1.default.updateUserStatus(+req.params.id, roles_1.Roles.DRIVER, req.body.status);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Driver status updated successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
    async updatePassengerStatus(req, res, next) {
        try {
            await userManagementService_1.default.updateUserStatus(+req.params.id, roles_1.Roles.USER, req.body.status);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Passenger status updated successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
    async createFCMToken(req, res, next) {
        try {
            const userId = req.user;
            await userManagementService_1.default.createFCMToken(userId, req.body.token);
            (0, response_1.default)(res, 201, {
                status: true,
                message: 'FCM token created successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
    async switchToDriver(req, res, next) {
        try {
            let token;
            if (req.headers.authorization) {
                token = req.headers.authorization.replace('Bearer ', '');
            }
            const { user: userId, language } = req;
            const [user, activeTrip] = await Promise.all([
                userService_1.default.getProfile(userId),
                tripService_1.default.getActiveTrip(userId, roles_1.Roles.DRIVER),
            ]);
            const tokens = userManagementService_1.default.switchToDriver(token, user);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Switched to driver successfully',
                result: {
                    ...tokens,
                    ...(0, user_serialization_1.serializeUser)(user, language, roles_1.Roles.DRIVER),
                    role: roles_1.Roles.DRIVER,
                    activeTrip: activeTrip
                        ? (0, activeTrip_serialization_1.serializeActiveTrip)(activeTrip, language, roles_1.Roles.DRIVER)
                        : null,
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    async switchToUser(req, res, next) {
        try {
            let token;
            if (req.headers.authorization) {
                token = req.headers.authorization.replace('Bearer ', '');
            }
            const { user: userId, language } = req;
            const tokens = userManagementService_1.default.switchToUser(token);
            const [user, activeTrip] = await Promise.all([
                userService_1.default.getProfile(userId),
                tripService_1.default.getActiveTrip(userId, roles_1.Roles.USER),
            ]);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Switched to user successfully',
                result: {
                    ...tokens,
                    ...(0, user_serialization_1.serializeUser)(user, language, roles_1.Roles.USER),
                    role: roles_1.Roles.USER,
                    activeTrip: activeTrip
                        ? (0, activeTrip_serialization_1.serializeActiveTrip)(activeTrip, language, roles_1.Roles.USER)
                        : null,
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
}
const userManagementController = new UserManagementController();
exports.default = userManagementController;
