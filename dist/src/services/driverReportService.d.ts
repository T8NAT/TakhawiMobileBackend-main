import { Review } from '../types/reviewType';
import { IDriverReportService } from '../interfaces/driverReportService';
import { TripRevenue } from '../types/driverReportType';
import { Language } from '../types/languageType';
import { QueryType } from '../types/queryType';
declare class DriverReportService implements IDriverReportService {
    getDriverReportPerMonth(driverId: number, noOfMonth: string): Promise<TripRevenue>;
    getDriverProfitReport(driverId: number, lang: Language, query: QueryType): Promise<{
        data: {
            totalProfit: number;
            tripsReport: unknown;
        };
        pagination: {
            totalPages: number;
            totalItems: number;
            page: number;
            limit: number;
        };
    }>;
    getOneTripReport(driverId: number, tripId: number): Promise<{
        id: number;
        start_date: Date;
        end_date: Date | null;
        price: number;
        driver_app_share: number;
        Basic_Trip: {
            price_per_seat: number;
            Pickup_Location: {
                id: number;
                ar_name: string;
                en_name: string;
                location: import(".prisma/client").Prisma.JsonValue;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                cityId: number;
            };
            Destination: {
                id: number;
                ar_name: string;
                en_name: string;
                location: import(".prisma/client").Prisma.JsonValue;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                cityId: number;
            };
            Passengers: {
                discount: number;
                user_app_share: number;
                payment_method: string;
                app_share_discount: number;
                Passnger: {
                    name: string;
                    avatar: string | null;
                    passenger_rate: number;
                };
            }[];
        } | null;
        VIP_Trip: {
            discount: number;
            user_app_share: number;
            payment_method: string | null;
            app_share_discount: number;
            Passnger: {
                name: string;
                avatar: string | null;
                passenger_rate: number;
            };
            pickup_description: string;
            destination_description: string;
        } | null;
    }>;
    tripReviewReport(driverId: number, tripId: number): Promise<Review[]>;
    getDriverFinancialSummary(driverId: number): Promise<{
        totalProfit: number;
        totalTrips: number;
        driverWalletBalance: number;
        dailyRevenue: unknown;
    }>;
    getTripPrice(driverId: number): Promise<{
        totalProfit: number;
        totalTrips: number;
    }>;
}
declare const driverReportService: DriverReportService;
export default driverReportService;
