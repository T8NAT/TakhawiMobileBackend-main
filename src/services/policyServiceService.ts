import prisma from '../../prisma/client';
import { IPolicyServiceService } from '../interfaces/policyServiceService';
import {
  CreatePolicyService,
  UpdatePolicyService,
  PolicyService,
} from '../types/policyServiceType';
import ApiError from '../utils/ApiError';

class PolicyServiceService implements IPolicyServiceService {
  async createPrivacyPolicy(data: CreatePolicyService): Promise<PolicyService> {
    const privacyPolicy = await prisma.privacy_Policy.findFirst({});
    if (privacyPolicy) {
      throw new ApiError('Privacy policy already exist', 400);
    }
    return prisma.privacy_Policy.create({ data });
  }

  async createTermsAndConditions(
    data: CreatePolicyService,
  ): Promise<PolicyService> {
    const termsAndConditions = await prisma.terms_And_Conditions.findFirst({});
    if (termsAndConditions) {
      throw new ApiError('Terms and conditions already exist', 400);
    }
    return prisma.terms_And_Conditions.create({ data });
  }

  async getPrivacyPolicy(): Promise<PolicyService> {
    const privacyPolicy = await prisma.privacy_Policy.findFirst({});
    if (!privacyPolicy) {
      throw new ApiError('Privacy policy not found', 404);
    }
    return privacyPolicy;
  }

  async getTermsAndConditions(): Promise<PolicyService> {
    const termsAndConditions = await prisma.terms_And_Conditions.findFirst({});
    if (!termsAndConditions) {
      throw new ApiError('Terms and conditions not found', 404);
    }
    return termsAndConditions;
  }

  async updatePrivacyPolicy(data: UpdatePolicyService): Promise<PolicyService> {
    const privacyPolicy = await prisma.privacy_Policy.findFirst({});
    if (!privacyPolicy) {
      throw new ApiError('Privacy policy not found', 404);
    }
    return prisma.privacy_Policy.update({
      where: { id: privacyPolicy.id },
      data,
    });
  }

  async updateTermsAndConditions(
    data: UpdatePolicyService,
  ): Promise<PolicyService> {
    const termsAndConditions = await prisma.terms_And_Conditions.findFirst({});
    if (!termsAndConditions) {
      throw new ApiError('Terms and conditions not found', 404);
    }
    return prisma.terms_And_Conditions.update({
      where: { id: termsAndConditions.id },
      data,
    });
  }
}
const policyServiceService = new PolicyServiceService();
export default policyServiceService;
