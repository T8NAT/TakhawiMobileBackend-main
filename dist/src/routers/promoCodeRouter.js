"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const promoCodeController_1 = __importDefault(require("../controllers/promoCodeController"));
const joiMiddleware_1 = __importDefault(require("../middlewares/joiMiddleware"));
const promoCodeValidations_1 = require("../validations/promoCodeValidations");
const router = (0, express_1.Router)();
router.post('/check-code', promoCodeController_1.default.checkPromoCode);
router
    .route('/')
    .get(promoCodeController_1.default.getAll)
    .post((0, joiMiddleware_1.default)(promoCodeValidations_1.createPromoCodeValidations), promoCodeController_1.default.create);
router
    .route('/:id')
    .get(promoCodeController_1.default.getOne)
    .patch((0, joiMiddleware_1.default)(promoCodeValidations_1.updatePromoCodeValidations), promoCodeController_1.default.update)
    .delete(promoCodeController_1.default.delete);
exports.default = router;
