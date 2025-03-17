/// <reference types="i18n" />
/// <reference types="express-serve-static-core" />
/// <reference types="multer" />
import { IDriverService } from '../interfaces/driverService';
import { CheckImageUploadStatus } from '../types/driverType';
import { Location, NearestDrivers } from '../types/userType';
declare class DriverService implements IDriverService {
    getNearestDrivers(location: Location, gender: string, d: number): Promise<NearestDrivers[]>;
    uploadNationalID(userId: number, national_id: string, role: string, files: Express.Request['files']): Promise<void>;
    uploadDriverLicense(userId: number, files: Express.Request['files']): Promise<void>;
    checkUploadStatus(temp_id: string): Promise<CheckImageUploadStatus>;
    private static EXPECTED_COUNTS;
    private prepareDocuments;
    private checkImageExists;
}
declare const driverService: DriverService;
export default driverService;
