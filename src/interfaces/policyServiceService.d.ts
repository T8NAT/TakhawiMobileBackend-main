import {
  CreatePolicyService,
  UpdatePolicyService,
  PolicyService,
} from '../types/policyServiceType';

export interface IPolicyServiceService {
  createTermsAndConditions(data: CreatePolicyService): Promise<PolicyService>;
  createPrivacyPolicy(data: CreatePolicyService): Promise<PolicyService>;
  updateTermsAndConditions(data: UpdatePolicyService): Promise<PolicyService>;
  updatePrivacyPolicy(data: UpdatePolicyService): Promise<PolicyService>;
  getTermsAndConditions(): Promise<PolicyService>;
  getPrivacyPolicy(): Promise<PolicyService>;
}
