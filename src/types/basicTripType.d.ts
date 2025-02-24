import { MeetingLocation } from './meetingLocationType';
import { QueryType } from './queryType';
import { Trip } from './tripType';
import { User } from './userType';

export interface BasicTrip extends Omit<Trip, 'price' | 'type' | 'gender'> {
  seats_no: number;
  available_seats_no: number;
  price_per_seat: number;
  pickup_location_id: number;
  destination_id: number;
}

export interface BasicTripSnippet {
  seats_no: number;
  available_seats_no: number;
  price_per_seat: number;
  pickup_location_id: number;
  destination_id: number;
  Pickup_Location?: MeetingLocation;
  Destination?: MeetingLocation;
  Passengers?: JoinBasicTrip[];
}

export interface JoinBasicTrip {
  id: number;
  trip_id: number;
  passenger_id: number;
  payment_status: string;
  payment_method: string;
  app_share_discount: number;
  user_app_share: number;
  driver_app_share: number;
  user_debt: number;
  user_tax: number;
  createdAt: Date;
  updatedAt: Date;
  discount: number;
  status?: string;
  coupon?: string;
  Passnger?: User;
  card_id?: number;
}

export interface CancelBasicTrip {
  passenger_trip_id: number;
  trip_id: number;
  user_id: number;
  reason: string;
  note?: string;
}

export type CreateBasicTrip = Omit<
  BasicTrip,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;
export type JoinBasicTripType = Omit<
  JoinBasicTrip,
  | 'createdAt'
  | 'updatedAt'
  | 'status'
  | 'user_app_share'
  | 'user_debt'
  | 'user_tax'
  | 'app_share_discount'
  | 'driver_app_share'
> & {
  html?: string;
  transactionId?: string;
};
export type CalculateTripPrice = {
  trip_id: number;
  passenger_id: number;
  coupon?: string;
};
export type TripPrice = {
  price: number;
  app_share: number;
  debt: number;
  discount: number;
  total_price: number;
};

export type TripBillingDetails = TripPrice & {
  has_app_share_discount: boolean;
  has_debt: boolean;
  user_wallet_balance: number;
  promo_code_id?: number;
};

export type BasicTripQueryType = QueryType & {
  cityPickupId?: number;
  destinationLat?: number;
  destinationLng?: number;
  startDate?: Date;
  sortBy?: string;
};
