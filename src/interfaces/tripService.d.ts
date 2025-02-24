import { PaginateType } from '../types/paginateType';
import { Trip, TripQueryType, TripStatusChangeReturn } from '../types/tripType';

export interface ITripService {
  getCompletedTrips(
    userId: number,
    query: TripQueryType,
    role: string,
  ): Promise<PaginateType<Trip>>;
  getCancelledTrips(
    userId: number,
    query: TripQueryType,
    role: string,
  ): Promise<PaginateType<Trip>>;
  getUpcomingTrips(
    userId: number,
    query: TripQueryType,
    role: string,
  ): Promise<PaginateType<Trip>>;
  updateTripStatus(
    tripId: number,
    status: string,
    userId: number,
  ): Promise<TripStatusChangeReturn>;
  getActiveTrip(userId: number, role: string): Promise<Trip | null>;
}
