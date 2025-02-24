import { PolicyService } from '../../types/policyServiceType';
import { Language } from '../../types/languageType';

export const serializePolicyService = (
  policyService: PolicyService,
  lang: Language,
) => {
  const { ar_content, en_content, ...rest } = policyService;
  return {
    ...rest,
    content: policyService[`${lang}_content`],
  };
};
