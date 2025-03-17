"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const meetingLocationController_1 = __importDefault(require("../controllers/meetingLocationController"));
const joiMiddleware_1 = __importDefault(require("../middlewares/joiMiddleware"));
const meetingLocationValidations_1 = require("../validations/meetingLocationValidations");
const router = (0, express_1.Router)();
router
    .route('/')
    .get(meetingLocationController_1.default.getAll)
    .post((0, joiMiddleware_1.default)(meetingLocationValidations_1.createMeetingLocationValidations), meetingLocationController_1.default.create);
router
    .route('/:id')
    .get(meetingLocationController_1.default.getOne)
    .patch((0, joiMiddleware_1.default)(meetingLocationValidations_1.updateMeetingLocationValidations), meetingLocationController_1.default.update)
    .delete(meetingLocationController_1.default.delete);
exports.default = router;
