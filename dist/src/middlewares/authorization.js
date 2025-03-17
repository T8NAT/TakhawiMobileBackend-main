"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiError_1 = __importDefault(require("../utils/ApiError"));
exports.default = (...roles) => (req, res, next) => {
    if (!roles.includes(req.role)) {
        return next(new ApiError_1.default('You do not have permission to perform this action', 403));
    }
    next();
};
