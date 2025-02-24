import { City } from './cityType';
import { Hobby } from './hobbyType';
import { QueryType } from './queryType';
import { Vehicle } from './vehicleType';

export interface User {
  id: number;
  uuid: string;
  name: string;
  phone: string;
  email: string;
  password: string;
  role: string;
  avatar: string | null;
  birth_date: Date | null;
  bio: string | null;
  national_id: string | null;
  gender: string;
  online_status: string;
  location: Json;
  prefered_language: string;
  profile_complted: number;
  phone_verified: boolean;
  switch_to_driver: boolean;
  is_blocked: boolean;
  discount_app_share_count: number;
  user_wallet_balance: number;
  driver_wallet_balance: number;
  driver_status: string;
  passenger_status: string;
  passenger_rate: number;
  driver_rate: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  cityId: number | null;
  Vehicles?: Vehicle[];
  Hobbies?: Hobby[];
  City?: City | null;
  User_FCM_Token?: FCMToken[];
}

export type CreateUser = Omit<
  User,
  | 'id'
  | 'createdAt'
  | 'updatedAt'
  | 'deletedAt'
  | 'phone_verified'
  | 'switch_to_driver'
  | 'is_blocked'
  | 'uuid'
  | 'location'
  | 'Vehicles'
  | 'driver_status'
  | 'passenger_status'
  | 'Hobbies'
  | 'City'
  | 'User_FCM_Token'
> & {
  hobbies: number[];
};

export type UpdateUser = Partial<CreateUser>;
export type NearestDrivers = Partial<User> & {
  distance: number;
  tokens: string[];
};
export type UserQueryType = QueryType & {
  role?: string;
  passenger_status?: string;
  driver_status?: string;
  user_activity_status?: string;
  wasl_registration_status?: string;
};

export type Location = {
  lat: number;
  lng: number;
};

export type FCMToken = {
  id: number;
  token: string;
  userId: number;
  createdAt: Date;
};
