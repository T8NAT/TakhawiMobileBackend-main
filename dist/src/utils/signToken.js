"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTokens = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signToken = (payload, sekretKey, expiresIn) => jsonwebtoken_1.default.sign(payload, sekretKey, { expiresIn });
const generateTokens = (user) => {
    const payload = { id: user.uuid, role: user.role };
    const accessToken = signToken(payload, process.env.SECRET_KEY_ACCESSTOKEN, process.env.EXPIRE_ACCESS_TOKEN);
    const refreshToken = signToken(payload, process.env.SECRET_KEY_REFRESHTOKEN, process.env.EXPIRE_REFRESH_TOKEN);
    return { accessToken, refreshToken };
};
exports.generateTokens = generateTokens;
