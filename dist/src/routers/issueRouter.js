"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const issueController_1 = __importDefault(require("../controllers/issueController"));
const joiMiddleware_1 = __importDefault(require("../middlewares/joiMiddleware"));
const issueValidations_1 = require("../validations/issueValidations");
const auth_1 = __importDefault(require("../middlewares/auth"));
const router = (0, express_1.Router)();
router.use(auth_1.default);
router
    .route('/')
    .post((0, joiMiddleware_1.default)(issueValidations_1.createIssueValidation), issueController_1.default.create)
    .get((0, joiMiddleware_1.default)(issueValidations_1.issueTypeQueryValidation, 'query'), issueController_1.default.getAll);
router
    .route('/:id')
    .get(issueController_1.default.getOne)
    .patch((0, joiMiddleware_1.default)(issueValidations_1.updateIssueValidation), issueController_1.default.update)
    .delete(issueController_1.default.delete);
exports.default = router;
