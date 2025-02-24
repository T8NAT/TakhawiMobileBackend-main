import { Reason } from '../../types/reasonType';
import { Language } from '../../types/languageType';

export const serializeReason = (reason: Reason, lang: Language) => {
  const { ar_reason: arReason, en_reason: enReason, ...rest } = reason;
  return {
    ...rest,
    reason: reason[`${lang}_reason`],
  };
};

export const serializeReasons = (reasons: Reason[], lang: Language) =>
  reasons.map((reason) => serializeReason(reason, lang));
