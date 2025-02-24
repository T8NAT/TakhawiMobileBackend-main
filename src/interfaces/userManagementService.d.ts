import { Location } from '../types/userType';
export interface IUserManagementService {
  updateLocation(id: number, location: Location): Promise<void>;
  updateUserStatus(id: number, role: string, status: string): Promise<void>;
  createFCMToken(userId: number, token: string): Promise<void>;
}
