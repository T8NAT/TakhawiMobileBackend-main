"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDateToHijriAndGregorian = void 0;
const moment_hijri_1 = __importDefault(require("moment-hijri"));
function formatDateToHijriAndGregorian(date, key) {
    moment_hijri_1.default.locale('en'); // Set the default locale to English cus the default is Arabic
    if (key === 'gregorian') {
        return (0, moment_hijri_1.default)(date).format('YYYY-MM-DD');
    }
    return (0, moment_hijri_1.default)(date).format('iYYYY-iMM-iDD');
}
exports.formatDateToHijriAndGregorian = formatDateToHijriAndGregorian;
