import { QueryType } from './queryType';

export interface WaslTripLog {
  id: number;
  trip_id: number;
  status: boolean;
  result_code: string;
  result_msg: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateWaslTripLog = Omit<
  WaslTripLog,
  'id' | 'createdAt' | 'updatedAt'
>;

export type CreateWaslTrip = {
  sequenceNumber: string;
  driverId: string;
  tripId: number;
  distanceInMeters: number;
  durationInSeconds: number;
  customerRating: number;
  customerWaitingTimeInSeconds: number;
  originLatitude: number;
  originLongitude: number;
  destinationLatitude: number;
  destinationLongitude: number;
  pickupTimestamp: string;
  dropoffTimestamp: string;
  startedWhen: string;
  tripCost: number;
};

export type WaslTripLogQueryType = QueryType & {};
