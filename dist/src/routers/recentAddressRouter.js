"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const recentAddressController_1 = __importDefault(require("../controllers/recentAddressController"));
const auth_1 = __importDefault(require("../middlewares/auth"));
const joiMiddleware_1 = __importDefault(require("../middlewares/joiMiddleware"));
const recentAddressValidations_1 = require("../validations/recentAddressValidations");
const recentAddressRouter = (0, express_1.Router)();
recentAddressRouter
    .route('/')
    .post(auth_1.default, (0, joiMiddleware_1.default)(recentAddressValidations_1.createRecentAddressSchema), recentAddressController_1.default.create)
    .get(auth_1.default, recentAddressController_1.default.getAll);
recentAddressRouter.delete('/:id', auth_1.default, recentAddressController_1.default.delete);
exports.default = recentAddressRouter;
