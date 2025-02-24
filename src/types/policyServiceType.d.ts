export interface PolicyService {
  id: number;
  ar_content: string;
  en_content: string;
  createdAt: Date;
  updatedAt: Ddaate;
}

export type CreatePolicyService = Omit<
  PolicyService,
  'id' | 'createdAt' | 'updatedAt'
>;

export type UpdatePolicyService = Partial<CreatePolicyService>;
