import { SavedCardType } from '../types/savedCardType';

export interface ISavedCardService {
  create: (id: number) => Promise<string>;
  getOne: (
    id: number,
    userId: number,
  ) => Promise<
    Omit<
      SavedCardType,
      'token' | 'recurringAgreementId' | 'initialTransactionId'
    >
  >;
  getAll: (
    userId: number,
  ) => Promise<
    Omit<
      SavedCardType,
      'token' | 'recurringAgreementId' | 'initialTransactionId'
    >[]
  >;
  delete: (id: number, userId: number) => Promise<void>;
}
