import { IPolicyServiceService } from '../interfaces/policyServiceService';
import { CreatePolicyService, UpdatePolicyService, PolicyService } from '../types/policyServiceType';
declare class PolicyServiceService implements IPolicyServiceService {
    createPrivacyPolicy(data: CreatePolicyService): Promise<PolicyService>;
    createTermsAndConditions(data: CreatePolicyService): Promise<PolicyService>;
    getPrivacyPolicy(): Promise<PolicyService>;
    getTermsAndConditions(): Promise<PolicyService>;
    updatePrivacyPolicy(data: UpdatePolicyService): Promise<PolicyService>;
    updateTermsAndConditions(data: UpdatePolicyService): Promise<PolicyService>;
}
declare const policyServiceService: PolicyServiceService;
export default policyServiceService;
