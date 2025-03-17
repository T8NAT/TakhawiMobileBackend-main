"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const hobbyController_1 = __importDefault(require("../controllers/hobbyController"));
const joiMiddleware_1 = __importDefault(require("../middlewares/joiMiddleware"));
const hobbyValidations_1 = require("../validations/hobbyValidations");
const router = (0, express_1.Router)();
router.route('/')
    .get(hobbyController_1.default.getAll)
    .post((0, joiMiddleware_1.default)(hobbyValidations_1.createHobbyValidations), hobbyController_1.default.create);
router.route('/:id')
    .get(hobbyController_1.default.getOne)
    .put((0, joiMiddleware_1.default)(hobbyValidations_1.updateHobbyValidations), hobbyController_1.default.update)
    .delete(hobbyController_1.default.delete);
exports.default = router;
