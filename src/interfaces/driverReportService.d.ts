import { TripRevenue } from '../types/driverReportType';
import { Review } from '../types/reviewType';

export interface IDriverReportService {
  getDriverReportPerMonth(
    driverId: number,
    noOfMonth: string,
  ): Promise<TripRevenue>;
  getDriverProfitReport(driverId: number, lang: Language, query: QueryType);
  getOneTripReport(driverId: number, tripId: number);
  tripReviewReport(driverId: number, tripId: number): Promise<Review[]>;
}
