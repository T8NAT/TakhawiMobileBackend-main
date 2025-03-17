"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeMeetingLocations = exports.serializeMeetingLocation = void 0;
const city_serialization_1 = require("./city.serialization");
const serializeMeetingLocation = (location, lang) => {
    const { ar_name: arName, en_name: enName, ...rest } = location;
    return {
        ...rest,
        name: location[`${lang}_name`],
        City: location.City ? (0, city_serialization_1.serializeCity)(location.City, lang) : undefined,
    };
};
exports.serializeMeetingLocation = serializeMeetingLocation;
const serializeMeetingLocations = (locations, lang) => locations.map((location) => (0, exports.serializeMeetingLocation)(location, lang));
exports.serializeMeetingLocations = serializeMeetingLocations;
