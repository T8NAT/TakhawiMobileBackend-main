"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializePolicyService = void 0;
const serializePolicyService = (policyService, lang) => {
    const { ar_content, en_content, ...rest } = policyService;
    return {
        ...rest,
        content: policyService[`${lang}_content`],
    };
};
exports.serializePolicyService = serializePolicyService;
