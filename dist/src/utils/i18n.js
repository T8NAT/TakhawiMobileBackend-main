"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const i18n_1 = require("i18n");
const path_1 = __importDefault(require("path"));
const languages_1 = require("../enum/languages");
exports.default = new i18n_1.I18n({
    locales: ['en', 'ar'],
    directory: path_1.default.join(__dirname, '../locales'),
    defaultLocale: languages_1.Languages.ENGLISH,
    updateFiles: false, // If true, the locale file will be updated with the new key and restart the server
    syncFiles: true,
});
