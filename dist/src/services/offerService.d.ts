import { AcceptOffer, AcceptOfferResponse, CalculateOffer, CreateOffer } from '../types/vipTripType';
declare class OfferService {
    applepayAcceptOffer(transactionId: string): Promise<AcceptOfferResponse>;
    makeOffer(trip_id: number, gender: string, data: CreateOffer): Promise<{
        Trip: {
            Passnger: {
                uuid: string;
                prefered_language: string;
                User_FCM_Tokens: {
                    id: number;
                    token: string;
                    userId: number;
                    createdAt: Date;
                }[];
            };
        };
        Driver: {
            name: string;
            avatar: string | null;
            driver_rate: number;
            Vehicles: {
                id: number;
                seats_no: number;
                serial_no: string;
                plate_alphabet: string;
                plate_alphabet_ar: string;
                plate_number: string;
                production_year: number;
                Vehicle_Color: {
                    ar_name: string;
                    en_name: string;
                };
                Vehicle_Class: {
                    ar_name: string;
                    en_name: string;
                };
                Vehicle_Type: {
                    ar_name: string;
                    en_name: string;
                };
                Vehicle_Name: {
                    ar_name: string;
                    en_name: string;
                };
            }[];
        };
    } & {
        id: number;
        price: number;
        app_share_discount: number;
        user_app_share: number;
        status: string;
        features: string[];
        driver_id: number;
        trip_id: number;
        vehicle_id: number;
        transactionId: string | null;
        createdAt: Date;
    }>;
    acceptOffer(offerId: number, userId: number, data: AcceptOffer): Promise<AcceptOfferResponse>;
    rejectOffer(offerId: number, userId: number): Promise<void>;
    checkWalletValidity(amount: number, userId: number): Promise<void>;
    calculateOfferPrice(data: CalculateOffer): Promise<{
        price: number;
        debt: number;
        app_share: number;
        discount: number;
        total_price: number;
    }>;
}
declare const offerService: OfferService;
export default offerService;
