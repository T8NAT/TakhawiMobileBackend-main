"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeReasons = exports.serializeReason = void 0;
const serializeReason = (reason, lang) => {
    const { ar_reason: arReason, en_reason: enReason, ...rest } = reason;
    return {
        ...rest,
        reason: reason[`${lang}_reason`],
    };
};
exports.serializeReason = serializeReason;
const serializeReasons = (reasons, lang) => reasons.map((reason) => (0, exports.serializeReason)(reason, lang));
exports.serializeReasons = serializeReasons;
