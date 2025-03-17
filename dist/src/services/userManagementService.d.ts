import { IUserManagementService } from '../interfaces/userManagementService';
import { Location, User } from '../types/userType';
declare class UserManagementService implements IUserManagementService {
    updateLocation(id: number, location: Location): Promise<void>;
    updateUserStatus(id: number, role: string, status: string): Promise<void>;
    createFCMToken(userId: number, token: string): Promise<void>;
    checkBalanceAndUpdateWallet(user: User, amount: number, trip_id: number): Promise<void>;
    switchToDriver(token?: string, user?: User): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    switchToUser(token?: string): {
        accessToken: string;
        refreshToken: string;
    };
}
declare const userManagementService: UserManagementService;
export default userManagementService;
