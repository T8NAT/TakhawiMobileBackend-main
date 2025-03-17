"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeCities = exports.serializeCity = void 0;
const serializeCity = (city, lang) => {
    const { ar_name: arName, en_name: enName, ...rest } = city;
    return {
        ...rest,
        name: city[`${lang}_name`],
    };
};
exports.serializeCity = serializeCity;
const serializeCities = (cities, lang) => cities.map((city) => (0, exports.serializeCity)(city, lang));
exports.serializeCities = serializeCities;
