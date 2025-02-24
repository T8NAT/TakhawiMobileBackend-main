import { Warning } from '@prisma/client';
import { Language } from '../../types/languageType';

export const serializeWarning = (warning: Warning, lang: Language) => {
  const { ar_type: artype, en_type: entype, ...rest } = warning;
  return {
    ...rest,
    type: warning[`${lang}_type`],
  };
};

export const serializeWarnings = (warnings: Warning[], lang: Language) =>
  warnings.map((warning) => serializeWarning(warning, lang));
