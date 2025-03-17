"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDistance = void 0;
const haversine_1 = __importDefault(require("haversine"));
// Default unit is kilometer
const getDistance = (start, end, unit) => (0, haversine_1.default)(start, end, { unit });
exports.getDistance = getDistance;
