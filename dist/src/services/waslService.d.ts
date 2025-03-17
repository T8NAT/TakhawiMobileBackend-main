import { CreateWaslTrip, CreateWaslTripLog, WaslTripLog, WaslTripLogQueryType } from '../types/waslType';
import { PaginateType } from '../types/paginateType';
declare class WaslService {
    private static readonly ENDPOINT;
    private static readonly HEADERS;
    createDriverandVehicleRegistration(userId: number): Promise<any>;
    getDriverandVehicleRegistration(userId: number): Promise<any>;
    createTripRegistration(body: CreateWaslTrip): Promise<any>;
    createTripLog(data: CreateWaslTripLog): Promise<WaslTripLog>;
    getTripsLog(queryString: WaslTripLogQueryType): Promise<PaginateType<WaslTripLog>>;
    mapResultCodeToHttpStatus(resultCode: string): number;
    returnPlateLetter(plate: string): {
        plateLetterLeft: string;
        plateLetterMiddle: string;
        plateLetterRight: string;
    };
}
declare const waslService: WaslService;
export default waslService;
