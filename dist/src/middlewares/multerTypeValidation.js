"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMulterArray = exports.validateMulterManyFilesType = exports.validateMulterType = void 0;
const fileHandler_1 = require("../utils/fileHandler");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const validateMulterType = (fileTypes, isFilesRequired = true) => (req, res, next) => {
    if (isFilesRequired && !req.file) {
        return next(new ApiError_1.default('Please upload a file', 400));
    }
    if (req.file) {
        const fileType = req.file.mimetype.split('/')[1];
        if (!fileTypes.includes(fileType)) {
            (0, fileHandler_1.removeFile)(req.file.path);
            return next(new ApiError_1.default(`Invalid file type. Allowed types are: ${fileTypes.join(', ')}`, 400));
        }
    }
    next();
};
exports.validateMulterType = validateMulterType;
const validateMulterManyFilesType = (files) => (req, res, next) => {
    const requestFiles = req.files || {};
    files.forEach((file) => {
        const uploadedKeys = Object.keys(requestFiles);
        if (file.isFilesRequired && !uploadedKeys.includes(file.name)) {
            return next(new ApiError_1.default(`Please upload ${file.name} file`, 400));
        }
        if (requestFiles[file.name]) {
            if (requestFiles[file.name].length > file.maxCount) {
                return next(new ApiError_1.default(`You can upload a maximum of ${file.maxCount} files`, 400));
            }
            if (requestFiles[file.name].length < file.minCount) {
                return next(new ApiError_1.default(`You must upload at least ${file.minCount} files`, 400));
            }
            requestFiles[file.name].forEach((f) => {
                const fileType = f.mimetype.split('/')[1];
                if (!file.acceptedFiles.includes(fileType)) {
                    (0, fileHandler_1.removeFile)(f.path);
                    return next(new ApiError_1.default(`Invalid file type. Allowed types are: ${file.acceptedFiles.join(', ')}`, 400));
                }
            });
        }
    });
    next();
};
exports.validateMulterManyFilesType = validateMulterManyFilesType;
const validateMulterArray = (fileTypes, minFiles = 0, maxFiles = Infinity, isFilesRequired = true) => (req, res, next) => {
    if (!isFilesRequired)
        return next();
    if (!req.files) {
        return next(new ApiError_1.default('Please upload a file', 400));
    }
    const requestFiles = req.files;
    if (requestFiles.length < minFiles) {
        return next(new ApiError_1.default(`Too few files. Minimum required is ${minFiles}`, 400));
    }
    if (requestFiles.length > maxFiles) {
        return next(new ApiError_1.default(`Too many files. Maximum allowed is ${maxFiles}`, 400));
    }
    requestFiles.forEach((f) => {
        const fileType = f.mimetype.split('/')[1];
        if (!fileTypes.includes(fileType)) {
            (0, fileHandler_1.removeFile)(f.path);
            return next(new ApiError_1.default(`Invalid file type. Allowed types are: ${fileTypes.join(', ')}`, 400));
        }
    });
    next();
};
exports.validateMulterArray = validateMulterArray;
