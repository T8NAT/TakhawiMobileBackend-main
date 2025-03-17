"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertDateToKSA = void 0;
const convertDateToKSA = (date) => {
    const convertedDate = new Date(date);
    convertedDate.setHours(convertedDate.getHours() + 3);
    return convertedDate.toISOString();
};
exports.convertDateToKSA = convertDateToKSA;
// const ksaDate = new Date().toLocaleString('en-US', {
//   timeZone: 'Asia/Riyadh',
// });
