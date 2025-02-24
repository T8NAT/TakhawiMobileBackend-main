export interface SavedCardType {
  id: number;
  token: string;
  card_number: string;
  card_holder: string;
  card_exp_month: string;
  card_exp_year: string;
  payment_brand: string;
  user_id: number;
  recurringAgreementId: string;
  initialTransactionId: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
