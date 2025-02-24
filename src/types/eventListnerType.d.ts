import { Language } from './languageType';
import { FCMToken } from './userType';
import { Offer } from './vipTripType';

export type NewOfferType = {
  roomId: string;
  language: Language;
  offer: Offer;
  fcm_tokens: FCMToken[];
};
