import { CheckImageUploadStatus } from '../types/driverType';

interface IDriverService {
  uploadNationalID: (
    userId: number,
    national_id: string,
    role: string,
    files: Express.Multer.File[],
  ) => Promise<void>;
  uploadDriverLicense: (
    userId: number,
    files: Express.Multer.File[],
  ) => Promise<void>;
  checkUploadStatus: (temp_id: string) => Promise<CheckImageUploadStatus>;
}
