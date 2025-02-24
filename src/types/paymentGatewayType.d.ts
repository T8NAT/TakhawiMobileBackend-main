export type PaymentInputType = {
  userId: number;
  amount: number;
  cardId?: number; // Optional, used in card payments
  tripOrOfferId?: number; // Optional, used in wallet payments
  type: string;
};

export type PaymentDataType = {
  token: string;
  amount: number;
  recurringAgreementId: string;
  merchantTransactionId: string;
  userId: number;
  cardId: number;
};

type Method = 'GET' | 'POST' | 'DELETE';

export interface ReqOptions {
  port: number;
  host: string;
  path: string;
  method: Method;
  headers: {
    Authorization: string;
    'Content-Type'?: string;
    'Content-Length'?: number;
  };
}

export type ReqOptionsType = {
  path: string;
  method: Method;
  length?: number;
};

export type ResponseType = {
  result: {
    code: string;
    description: string;
  };
  buildNumber: string;
  timestamp: string;
  ndc: string;
};

export type ResponseCheckoutType = ResponseType & { id: string };

export type ResponseRegistrationType = ResponseType & {
  id: string;
  registrationId: string;
  paymentType: DB;
  paymentBrand: VISA | MASTER | MADA;
  card: {
    bin: string;
    binCountry: string;
    last4Digits: string;
    holder: string;
    expiryMonth: string;
    expiryYear: string;
    issuer: {
      bank: string;
    };
    type: string;
    level: string;
    country: string;
    maxPanLength: string;
    binType: string;
    regulatedFlag: string;
  };
  customer: {
    ip: string;
    ipCountry: string;
  };
  customParameters: {
    SHOPPER_EndToEndIdentity: string;
  };
};

export type ResponseInitialPaymentType = ResponseType & {
  id: string;
  registrationId: string;
  paymentType: DB;
  paymentBrand: PaymentBrand;
  amount: string;
  currency: string;
  descriptor: string;
  merchantTransactionId: string;
  card: {
    bin: string;
    binCountry: string;
    last4Digits: string;
    holder: string;
    expiryMonth: string;
    expiryYear: string;
    issuer: {
      bank: string;
    };
    type: string;
    level: string;
    country: string;
    maxPanLength: string;
    binType: string;
    regulatedFlag: string;
  };
  customer: {
    givenName: string;
    surname: string;
    email: string;
    ip: string;
    ipCountry: string;
  };
  billing: {
    street1: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  threeDSecure: {
    eci: string;
  };
  customParameters: {
    SHOPPER_EndToEndIdentity: string;
    StandingInstructionAPI: string;
    CTPE_DESCRIPTOR_TEMPLATE: string;
    StoredCredentialType: string;
    recurringPaymentAgreement: string;
    CardholderInitiatedTransactionID: string;
  };
  risk: {
    score: string;
  };
  standingInstruction: {
    source: string;
    type: string;
    mode: string;
    initialTransactionId: string;
    expiry: string;
  };
};

export type ResponsePaymentType = ResponseType & {
  id: string;
  paymentType: DB;
  amount: string;
  currency: SAR;
  descriptor: string;
  resultDetails: {
    ConnectorTxID1: string;
    connectorId: string;
    ConnectorTxID2: string;
    CardholderInitiatedTransactionID: string;
    'response.acquirerCode': string;
    ExtendedDescription: string;
    clearingInstituteName: string;
    'authorizationResponse.stan': string;
    merchantCategoryCode: string;
    'transaction.acquirer.settlementDate': string;
    'transaction.receipt': string;
    AcquirerResponse: string;
    reconciliationId: string;
    'transaction.authorizationCode': string;
    'response.acquirerMessage': string;
  };
  risk: {
    score: string;
  };
  standingInstruction: {
    source: MIT;
    type: UNSCHEDULED;
    mode: REPEATED;
    initialTransactionId: string;
  };
};

export type UserBillingType = {
  email: string;
  city: string;
  givenName: string;
  postcode: string;
  state: string;
  street1: string;
  surname: string;
  recurringAgreementId: string;
};

export type CreateUserBillingInfo = {
  state: string;
  street: string;
  surname: string;
  cityId: number;
  userId: number;
};
