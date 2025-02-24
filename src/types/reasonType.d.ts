export interface Reason {
  id: number;
  ar_reason: string;
  en_reason: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export type CreateReason = Omit<
  Reason,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;
export type UpdateReason = Partial<ReasonCreateInput>;
