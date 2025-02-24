export type SMSVerificationData = {
  lang: string;
  code: string;
  id: string;
};

export type SMSResponseType = {
  code: number;
  message: string;
};

export type SMSResponseOTPType = SMSResponseType & { id: string };
