"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __importDefault(require("../../prisma/client"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
class PolicyServiceService {
    async createPrivacyPolicy(data) {
        const privacyPolicy = await client_1.default.privacy_Policy.findFirst({});
        if (privacyPolicy) {
            throw new ApiError_1.default('Privacy policy already exist', 400);
        }
        return client_1.default.privacy_Policy.create({ data });
    }
    async createTermsAndConditions(data) {
        const termsAndConditions = await client_1.default.terms_And_Conditions.findFirst({});
        if (termsAndConditions) {
            throw new ApiError_1.default('Terms and conditions already exist', 400);
        }
        return client_1.default.terms_And_Conditions.create({ data });
    }
    async getPrivacyPolicy() {
        const privacyPolicy = await client_1.default.privacy_Policy.findFirst({});
        if (!privacyPolicy) {
            throw new ApiError_1.default('Privacy policy not found', 404);
        }
        return privacyPolicy;
    }
    async getTermsAndConditions() {
        const termsAndConditions = await client_1.default.terms_And_Conditions.findFirst({});
        if (!termsAndConditions) {
            throw new ApiError_1.default('Terms and conditions not found', 404);
        }
        return termsAndConditions;
    }
    async updatePrivacyPolicy(data) {
        const privacyPolicy = await client_1.default.privacy_Policy.findFirst({});
        if (!privacyPolicy) {
            throw new ApiError_1.default('Privacy policy not found', 404);
        }
        return client_1.default.privacy_Policy.update({
            where: { id: privacyPolicy.id },
            data,
        });
    }
    async updateTermsAndConditions(data) {
        const termsAndConditions = await client_1.default.terms_And_Conditions.findFirst({});
        if (!termsAndConditions) {
            throw new ApiError_1.default('Terms and conditions not found', 404);
        }
        return client_1.default.terms_And_Conditions.update({
            where: { id: termsAndConditions.id },
            data,
        });
    }
}
const policyServiceService = new PolicyServiceService();
exports.default = policyServiceService;
