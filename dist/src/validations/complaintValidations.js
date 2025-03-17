"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateComplaintValidations = exports.createComplaintValidations = void 0;
const joi_1 = __importDefault(require("joi"));
const complaintCategory_1 = require("../enum/complaintCategory");
exports.createComplaintValidations = joi_1.default.object().keys({
    category: joi_1.default.when('is_complaint', {
        is: true,
        then: joi_1.default.string().valid(...Object.values(complaintCategory_1.ComplaintCategory)).required(),
        otherwise: joi_1.default.string().valid(...Object.values(complaintCategory_1.ComplaintCategory)).optional(),
    }),
    note: joi_1.default.string().min(10).required(),
    is_complaint: joi_1.default.boolean().optional(),
});
exports.updateComplaintValidations = joi_1.default.object().keys({
    category: joi_1.default.string().valid(...Object.values(complaintCategory_1.ComplaintCategory)).optional(),
    note: joi_1.default.string().min(10).optional(),
    is_complaint: joi_1.default.boolean().optional(),
});
