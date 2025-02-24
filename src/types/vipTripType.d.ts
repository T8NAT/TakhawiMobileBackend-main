import { TripBillingDetails } from './basicTripType';
import { Trip } from './tripType';
import { FCMToken, User } from './userType';

export type VipTrip = Trip & {
  VIP_Trip: VipTripSnippet | null;
};

export type VipTripSnippet = {
  pickup_location_lat: number;
  pickup_location_lng: number;
  pickup_description: string;
  destination_location_lat: number;
  destination_location_lng: number;
  destination_description: string;
  payment_status: string | null;
  payment_method: string | null;
  app_share_discount: number;
  discount: number;
  user_app_share: number;
  user_debt: number;
  passnger_id: number;
  trip_id: number;
  createdAt: Date;
  updatedAt: Date;
  Passnger?: User;
};

export type CreateVipTrip = {
  start_date: Date;
  gender: string;
  pickup_location_lat: number;
  pickup_location_lng: number;
  pickup_description: string;
  destination_location_lat: number;
  destination_location_lng: number;
  destination_description: string;
  distance: number;
  passnger_id: number;
  features: string[];
};

export interface Offer {
  id: number;
  price: number;
  status: string;
  features: string[];
  driver_id: number;
  trip_id: number;
  createdAt: Date;
  Driver?: User;
}

export type CreateOffer = Omit<
  Offer,
  'id' | 'createdAt' | 'trip_id' | 'status' | 'Driver' | 'Trip'
>;

export type AcceptOffer = {
  payment_method: string;
  coupon?: string;
  card_id?: number;
  paymentHtml?: string;
  transactionId?: string;
  tripPriceBreakdown: TripBillingDetails;
};

export type CancelTrip = {
  reason: string;
  note?: string;
};

export type CalculateOffer = {
  offerId: number;
  coupon?: string;
  userId: number;
};

export type AcceptOfferResponse = {
  tokens: FCMToken[];
  roomId: string;
  language: string;
};
