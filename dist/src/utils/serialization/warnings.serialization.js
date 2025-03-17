"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeWarnings = exports.serializeWarning = void 0;
const serializeWarning = (warning, lang) => {
    const { ar_type: artype, en_type: entype, ...rest } = warning;
    return {
        ...rest,
        type: warning[`${lang}_type`],
    };
};
exports.serializeWarning = serializeWarning;
const serializeWarnings = (warnings, lang) => warnings.map((warning) => (0, exports.serializeWarning)(warning, lang));
exports.serializeWarnings = serializeWarnings;
