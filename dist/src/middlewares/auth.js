"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const client_1 = __importDefault(require("../../prisma/client"));
const roles_1 = require("../enum/roles");
exports.default = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization) {
            token = req.headers.authorization.replace('Bearer ', '');
        }
        if (!token) {
            return next(new ApiError_1.default('No Token Provided', 401));
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY_ACCESSTOKEN);
        const user = await client_1.default.user.findUnique({
            where: {
                uuid: decoded.id,
            },
            select: {
                id: true,
                uuid: true,
                role: true,
                is_blocked: true,
                deletedAt: true,
                gender: true,
                location: true,
            },
        });
        if (!user) {
            return next(new ApiError_1.default('Unauthorized', 401));
        }
        if (user.is_blocked) {
            return next(new ApiError_1.default('Blocked', 403));
        }
        if (user.deletedAt) {
            return next(new ApiError_1.default('Deleted Account', 401));
        }
        req.user = user.id;
        req.role = decoded.role;
        req.gender = user.gender;
        req.temp_id = user.uuid;
        req.lat = user.location.lat;
        req.lng = user.location.lng;
        // That means if some one is user have a token with admin role and he is not an admin then we will change his role to his default role
        if (![roles_1.Roles.USER, roles_1.Roles.DRIVER].includes(decoded.role) && decoded.role !== user.role) {
            req.role = user.role;
        }
        next();
    }
    catch (error) {
        next(new ApiError_1.default('Invalid Token', 401));
    }
};
