import { QueryType } from './queryType';
import { FCMToken } from './userType';
import { CreateWaslTrip } from './waslType';

export interface Trip {
  id: number;
  start_date: Date;
  end_date: Date | null;
  pickup_time: Date | null;
  status: string;
  gender: string;
  type: string;
  driver_id: number | null;
  vehicle_id: number | null;
  price: number;
  driver_app_share: number;
  user_app_share: number;
  user_tax: number;
  distance: number;
  driver_tax: number;
  features: string[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export type TripQueryType = QueryType & {
  type?: string;
  status?: string;
  from?: Date;
  to?: Date;
};

export type VipTripQueryType = Partial<
  QueryType & {
    lat: number;
    lng: number;
    gender: string;
    distance: number;
  }
>;

export type CalculateTripPrice = {
  id: number;
  passenger_id: number;
  coupon?: string;
  type?: string;
};

export type DriverCancelationReturn = {
  type: string;
  users: {
    uuid: string;
    User_FCM_Tokens: FCMToken[];
    prefered_language: string;
  }[];
};

export type UserCancelationReturn = {
  type: string;
  user: {
    uuid: string;
    User_FCM_Tokens: FCMToken[];
    prefered_language: string;
  };
};

export type TripStatusChangeReturn = {
  id: number;
  status: string;
  driverId: number;
  users: {
    uuid: string;
    User_FCM_Tokens: FCMToken[];
    prefered_language: string;
  }[];
};

export interface EndTrip {
  tripSummary: CreateWaslTrip;
  tripStatusInfo: TripStatusChangeReturn;
}
