import {
  BasicTrip,
  CreateBasicTrip,
  JoinBasicTrip,
  JoinBasicTripType,
  CancelBasicTrip,
  BasicTripQueryType,
  TripBillingDetails,
} from '../types/basicTripType';
import {
  DriverCancelationReturn,
  EndTrip,
  UserCancelationReturn,
} from '../types/tripType';

export interface IBasicTripService {
  create(
    data: CreateBasicTrip,
    driverId: number,
    gender: string,
  ): Promise<BasicTrip>;
  getAll(
    userId: number,
    language: string,
    gender: string,
    queryString: BasicTripQueryType,
  ): Promise<PaginateType<BasicTrip>>;
  get(tripId: number, userId: number): Promise<BasicTrip>;
  join(
    data: JoinBasicTripType,
    tripPriceBreakdown: TripBillingDetails,
  ): Promise<JoinBasicTrip>;
  cancelByPassenger(
    data: CancelBasicTrip,
  ): Promise<UserCancelationReturn | undefined>;
  cancelByDriver(
    data: CancelBasicTrip,
  ): Promise<DriverCancelationReturn | undefined>;
  endTrip(tripId: number, driverId: number): Promise<EndTrip>;
}
