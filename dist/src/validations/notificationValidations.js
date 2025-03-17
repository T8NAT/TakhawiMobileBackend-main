"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotificationSchema = exports.createNotificationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const notification_1 = require("../enum/notification");
exports.createNotificationSchema = joi_1.default.object().keys({
    ar_title: joi_1.default.string().required(),
    ar_body: joi_1.default.string().required(),
    en_title: joi_1.default.string().required(),
    en_body: joi_1.default.string().required(),
    type: joi_1.default.string().valid(notification_1.NotificationTypes.COUPON).required(),
    userId: joi_1.default.number().strict().required(),
});
exports.sendNotificationSchema = joi_1.default.object().keys({
    body: joi_1.default.string().required(),
    title: joi_1.default.string().required(),
    imageUrl: joi_1.default.string().optional(),
    userIds: joi_1.default.array().items(joi_1.default.number()).optional(),
});
