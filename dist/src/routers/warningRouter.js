"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../middlewares/auth"));
const warningController_1 = __importDefault(require("../controllers/warningController"));
const warningValidtions_1 = require("../validations/warningValidtions");
const joiMiddleware_1 = __importDefault(require("../middlewares/joiMiddleware"));
const router = (0, express_1.Router)();
router.get('/:id', auth_1.default, warningController_1.default.getOne);
router
    .route('/')
    .post((0, joiMiddleware_1.default)(warningValidtions_1.createWarningSchema), auth_1.default, warningController_1.default.create)
    .get((0, joiMiddleware_1.default)(warningValidtions_1.getWarningQuerySchema, 'query'), warningController_1.default.getAll);
router.delete('/:id', auth_1.default, warningController_1.default.delete);
exports.default = router;
