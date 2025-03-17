import { TripStatus } from '../enum/trip';
import { ITripService } from '../interfaces/tripService';
import { TripBillingDetails } from '../types/basicTripType';
import { PaginateType } from '../types/paginateType';
import { TripQueryType, Trip, VipTripQueryType, CalculateTripPrice, TripStatusChangeReturn } from '../types/tripType';
declare class TripService implements ITripService {
    getCompletedTrips(userId: number, query: TripQueryType, role: string): Promise<PaginateType<Trip>>;
    getCancelledTrips(userId: number, query: TripQueryType, role: string): Promise<PaginateType<Trip>>;
    getUpcomingTrips(userId: number, query: TripQueryType, role: string): Promise<PaginateType<Trip>>;
    getTrips(query: TripQueryType): Promise<PaginateType<Trip>>;
    updateTripStatus(tripId: number, status: string, driverId: number): Promise<TripStatusChangeReturn>;
    tripCheck(tripId: number, driverId: number): Promise<Trip>;
    getActiveTrip(userId: number, role: string): Promise<any>;
    getNearByVipTrips(query: VipTripQueryType): Promise<any>;
    getOne(tripId: number, userId: number, role: string): Promise<any>;
    calculateTripPrice(data: CalculateTripPrice): Promise<TripBillingDetails>;
    validateDriverInLocation(tripId: number, status: TripStatus): Promise<void>;
}
declare const tripService: TripService;
export default tripService;
