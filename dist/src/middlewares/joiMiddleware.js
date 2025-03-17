"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.joiAsyncMiddleWare = void 0;
const response_1 = __importDefault(require("../utils/response"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
function joiMiddleWare(schema, location = 'body') {
    return async (req, res, next) => {
        try {
            const { error } = schema.validate(req[location], {
                abortEarly: true,
            });
            if (error) {
                const validationErrors = error.details.map((detail) => detail.message);
                return (0, response_1.default)(res, 400, { status: false, message: validationErrors[0] });
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
}
function joiAsyncMiddleWare(schema, location = 'body') {
    return async (req, res, next) => {
        try {
            await schema.validateAsync(req[location]);
            next();
        }
        catch (error) {
            next(new ApiError_1.default(error.message, 400));
        }
    };
}
exports.joiAsyncMiddleWare = joiAsyncMiddleWare;
exports.default = joiMiddleWare;
