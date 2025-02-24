import { PaginateType } from '../types/paginateType';
import {
  DriverCancelationReturn,
  UserCancelationReturn,
} from '../types/tripType';
import {
  CancelTrip,
  CreateVipTrip,
  Offer,
  VipTrip,
} from '../types/vipTripType';

export interface IVipTripService {
  create(data: CreateVipTrip): Promise<VipTrip>;
  cancel(
    trip_id: number,
    userId: number,
    data: CancelTrip,
  ): Promise<UserCancelationReturn | undefined>;
  driverCancelation(
    trip_id: number,
    driver_id: number,
    data: CancelTrip,
  ): Promise<DriverCancelationReturn>;
  getTripOffers(trip_id: number, query: any): Promise<PaginateType<Offer[]>>;
}
