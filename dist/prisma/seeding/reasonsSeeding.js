"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const reasons_json_1 = __importDefault(require("../data/reasons.json"));
const client_1 = __importDefault(require("../client"));
const reasonsSeeding = async () => {
    try {
        const existingReasons = await client_1.default.reason.findMany();
        if (existingReasons.length === 0) {
            await client_1.default.reason.createMany({ data: reasons_json_1.default });
        }
    }
    catch (error) {
        console.error('Error on reasons seeding:', error);
    }
};
exports.default = reasonsSeeding;
