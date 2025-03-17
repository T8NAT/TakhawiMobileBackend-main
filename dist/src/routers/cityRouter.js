"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cityController_1 = __importDefault(require("../controllers/cityController"));
const joiMiddleware_1 = __importDefault(require("../middlewares/joiMiddleware"));
const cityValidations_1 = require("../validations/cityValidations");
const router = (0, express_1.Router)();
router.route('/').get(cityController_1.default.getAll).post((0, joiMiddleware_1.default)(cityValidations_1.createCityValidations), cityController_1.default.create);
router
    .route('/:id')
    .get(cityController_1.default.getOne)
    .patch((0, joiMiddleware_1.default)(cityValidations_1.updateCityValidations), cityController_1.default.update)
    .delete(cityController_1.default.delete);
exports.default = router;
