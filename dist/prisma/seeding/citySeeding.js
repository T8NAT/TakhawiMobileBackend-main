"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __importDefault(require("../client"));
const cities_json_1 = __importDefault(require("../data/cities.json"));
const citySeeding = async () => {
    try {
        const cityExist = await client_1.default.city.findMany();
        if (cityExist.length === 0) {
            await client_1.default.city.createMany({
                data: cities_json_1.default.map((city) => city),
            });
        }
    }
    catch (error) {
        console.log('Error on city seeding');
    }
};
exports.default = citySeeding;
