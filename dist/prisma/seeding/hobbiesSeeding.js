"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __importDefault(require("../client"));
const hobbies_json_1 = __importDefault(require("../data/hobbies.json"));
const hobbiesSeeding = async () => {
    try {
        const existingHobbies = await client_1.default.hobbies.findMany();
        if (existingHobbies.length === 0) {
            await client_1.default.hobbies.createMany({ data: hobbies_json_1.default });
        }
    }
    catch (error) {
        console.error('Error on hobbies seeding:', error);
    }
};
exports.default = hobbiesSeeding;
