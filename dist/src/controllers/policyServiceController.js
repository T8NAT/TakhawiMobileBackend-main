"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const policyServiceService_1 = __importDefault(require("../services/policyServiceService"));
const response_1 = __importDefault(require("../utils/response"));
const policyService_serialization_1 = require("../utils/serialization/policyService.serialization");
class PolicyServiceController {
    async createPrivacyPolicy(req, res, next) {
        try {
            const policyService = await policyServiceService_1.default.createPrivacyPolicy(req.body);
            (0, response_1.default)(res, 201, {
                status: true,
                message: 'Privacy policy created successfully',
                result: policyService,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async updatePrivacyPolicy(req, res, next) {
        try {
            const policyService = await policyServiceService_1.default.updatePrivacyPolicy(req.body);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Privacy policy updated successfully',
                result: policyService,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getPrivacyPolicy(req, res, next) {
        try {
            const { language, skipLang } = req;
            const policyService = await policyServiceService_1.default.getPrivacyPolicy();
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Privacy policy retrieved successfully',
                result: skipLang
                    ? policyService
                    : (0, policyService_serialization_1.serializePolicyService)(policyService, language),
            });
        }
        catch (error) {
            next(error);
        }
    }
    async createTermsAndConditions(req, res, next) {
        try {
            const termsAndConditions = await policyServiceService_1.default.createTermsAndConditions(req.body);
            (0, response_1.default)(res, 201, {
                status: true,
                message: 'Terms and conditions created successfully',
                result: termsAndConditions,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async updateTermsAndConditions(req, res, next) {
        try {
            const termsAndConditions = await policyServiceService_1.default.updateTermsAndConditions(req.body);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Terms and conditions updated successfully',
                result: termsAndConditions,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getTermsAndConditions(req, res, next) {
        try {
            const { language, skipLang } = req;
            const termsAndConditions = await policyServiceService_1.default.getTermsAndConditions();
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Terms and conditions retrieved successfully',
                result: skipLang
                    ? termsAndConditions
                    : (0, policyService_serialization_1.serializePolicyService)(termsAndConditions, language),
            });
        }
        catch (error) {
            next(error);
        }
    }
}
const policyServiceController = new PolicyServiceController();
exports.default = policyServiceController;
