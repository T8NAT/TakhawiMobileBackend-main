"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pdfReportValidations = void 0;
const joi_1 = __importDefault(require("joi"));
exports.pdfReportValidations = joi_1.default.object().keys({
    type: joi_1.default.string().valid('download', 'preview').optional(),
});
