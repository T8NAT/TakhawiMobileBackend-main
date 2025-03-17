"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const folderHandler_1 = __importDefault(require("../utils/folderHandler"));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const fileType = file.mimetype.split('/')[1];
        const reqPath = req.originalUrl.split('/')[2];
        const path = `./uploads/${reqPath}/${fileType}`;
        (0, folderHandler_1.default)(path);
        cb(null, path);
    },
    filename: (req, file, cb) => {
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, fileName);
    },
});
const uploadToDiskStorage = (0, multer_1.default)({ storage });
exports.default = uploadToDiskStorage;
