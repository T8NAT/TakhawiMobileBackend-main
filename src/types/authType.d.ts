export type SignUpType = {
  name: string;
  phone: string;
  email: string;
  password: string;
  role: string;
  avatar?: string;
  birth_date: Date;
  bio?: string;
  national_id: string;
  gender: string;
  cityId: number;
};

export type LoginType = {
  phone: string;
  password: string;
};

export type VerifyResetCodeType = {
  phone: string;
  code: string;
};

export type ResetPasswordType = {
  phone: string;
  password: string;
};

export type ChangePasswordType = { oldPassword: string; newPassword: string };
