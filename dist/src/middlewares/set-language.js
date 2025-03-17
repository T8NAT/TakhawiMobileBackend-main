"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const i18n_1 = __importDefault(require("../utils/i18n"));
function setLanguage(req, res, next) {
    const language = req.headers['accept-language'] || 'en';
    req.language = language;
    req.skipLang = !!(req.headers.localization && req.headers.localization === 'false');
    i18n_1.default.setLocale(language); // Used to set the language for the i18n library in Socket.IO
    next();
}
exports.default = setLanguage;
