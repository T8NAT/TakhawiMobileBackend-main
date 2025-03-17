"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const policyServiceController_1 = __importDefault(require("../controllers/policyServiceController"));
const auth_1 = __importDefault(require("../middlewares/auth"));
const authorization_1 = __importDefault(require("../middlewares/authorization"));
const joiMiddleware_1 = __importDefault(require("../middlewares/joiMiddleware"));
const roles_1 = require("../enum/roles");
const policyServiceValidations_1 = require("../validations/policyServiceValidations");
const router = (0, express_1.Router)();
router.get('/privacy-policy', policyServiceController_1.default.getPrivacyPolicy);
router.get('/terms-and-conditions', policyServiceController_1.default.getTermsAndConditions);
router.use(auth_1.default, (0, authorization_1.default)(roles_1.Roles.ADMIN, roles_1.Roles.SUPER_ADMIN));
router
    .route('/privacy-policy')
    .post((0, joiMiddleware_1.default)(policyServiceValidations_1.createPolicyServiceValidation), policyServiceController_1.default.createPrivacyPolicy)
    .patch((0, joiMiddleware_1.default)(policyServiceValidations_1.updatePolicyServiceValidation), policyServiceController_1.default.updatePrivacyPolicy);
router
    .route('/terms-and-conditions')
    .post((0, joiMiddleware_1.default)(policyServiceValidations_1.createPolicyServiceValidation), policyServiceController_1.default.createTermsAndConditions)
    .patch((0, joiMiddleware_1.default)(policyServiceValidations_1.updatePolicyServiceValidation), policyServiceController_1.default.updateTermsAndConditions);
exports.default = router;
