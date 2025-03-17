"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllMessageSchema = exports.getAllChatSchema = exports.sendMessageSchema = exports.openChatSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const chat_1 = require("../enum/chat");
exports.openChatSchema = joi_1.default.object().keys({
    tripId: joi_1.default.number().strict().required(),
    userId: joi_1.default.when('driverId', {
        is: joi_1.default.exist(),
        then: joi_1.default.forbidden(),
        otherwise: joi_1.default.number().strict().required(),
    }),
    driverId: joi_1.default.number().strict().optional(),
});
exports.sendMessageSchema = joi_1.default.object().keys({
    chatId: joi_1.default.string().required(),
    content: joi_1.default.string().when('contentType', {
        is: joi_1.default.valid(chat_1.ContentType.TEXT),
        then: joi_1.default.required(),
        otherwise: joi_1.default.forbidden(),
    }),
    contentType: joi_1.default.string()
        .valid(...Object.values(chat_1.ContentType))
        .optional(),
});
exports.getAllChatSchema = joi_1.default.object().keys({
    page: joi_1.default.number().strict().optional(),
    limit: joi_1.default.number().strict().optional(),
});
exports.getAllMessageSchema = joi_1.default.object().keys({
    page: joi_1.default.number().strict().optional(),
    limit: joi_1.default.number().strict().optional(),
});
