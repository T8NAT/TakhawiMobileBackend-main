"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeHobbies = exports.serializeHobby = void 0;
const serializeHobby = (hobby, lang) => {
    const { ar_name: arName, en_name: enName, ...rest } = hobby;
    return {
        ...rest,
        name: hobby[`${lang}_name`],
    };
};
exports.serializeHobby = serializeHobby;
const serializeHobbies = (hobbies, lang) => hobbies.map((hobby) => (0, exports.serializeHobby)(hobby, lang));
exports.serializeHobbies = serializeHobbies;
