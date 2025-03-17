"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeUsers = exports.serializeUser = void 0;
const hobbies_serialization_1 = require("./hobbies.serialization");
const city_serialization_1 = require("./city.serialization");
const vehicle_serialization_1 = require("./vehicle.serialization");
const roles_1 = require("../../enum/roles");
const serializeUser = (user, lang, role) => {
    const { Hobbies, City, Vehicles, driver_rate, passenger_rate, ...rest } = user;
    return {
        ...rest,
        City: City ? (0, city_serialization_1.serializeCity)(City, lang) : undefined,
        Hobbies: Hobbies ? (0, hobbies_serialization_1.serializeHobbies)(Hobbies, lang) : undefined,
        rate: role === roles_1.Roles.DRIVER ? driver_rate : passenger_rate,
        Vehicles: role === roles_1.Roles.DRIVER && Vehicles && Vehicles.length > 0
            ? (0, vehicle_serialization_1.serializeVehicle)(Vehicles[0], lang)
            : null,
    };
};
exports.serializeUser = serializeUser;
const serializeUsers = (users, lang) => users.map((user) => (0, exports.serializeUser)(user, lang, user.role));
exports.serializeUsers = serializeUsers;
