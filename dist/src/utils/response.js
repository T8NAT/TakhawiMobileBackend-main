"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (res, statusCode, data) => {
    res.status(statusCode).json({
        ...data,
        message: /* res.__ ? res.__(data.message) :  */ data.message,
    });
};
