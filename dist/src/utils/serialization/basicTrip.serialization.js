"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.basicTripSerialization = void 0;
const hobbies_serialization_1 = require("./hobbies.serialization");
const basicTripSerialization = (trip, lang) => {
    const { Driver, ...rest } = trip;
    return {
        ...rest,
        Driver: {
            ...Driver,
            Hobbies: (0, hobbies_serialization_1.serializeHobbies)(Driver.Hobbies, lang),
        },
    };
};
exports.basicTripSerialization = basicTripSerialization;
