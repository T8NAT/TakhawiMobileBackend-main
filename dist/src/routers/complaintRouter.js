"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const complaintController_1 = __importDefault(require("../controllers/complaintController"));
const joiMiddleware_1 = __importDefault(require("../middlewares/joiMiddleware"));
const complaintValidations_1 = require("../validations/complaintValidations");
const auth_1 = __importDefault(require("../middlewares/auth"));
const router = (0, express_1.Router)();
router.use(auth_1.default);
router.route('/').get(complaintController_1.default.getAll).post((0, joiMiddleware_1.default)(complaintValidations_1.createComplaintValidations), complaintController_1.default.create);
router
    .route('/:id')
    .get(complaintController_1.default.getOne)
    .patch((0, joiMiddleware_1.default)(complaintValidations_1.updateComplaintValidations), complaintController_1.default.update)
    .delete(complaintController_1.default.delete);
exports.default = router;
