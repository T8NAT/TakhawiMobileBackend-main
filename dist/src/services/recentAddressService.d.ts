import { CreateRecentAddress, RecentAddress } from '../types/recentAddressType';
import { IRecentAddressService } from '../interfaces/recentAddressService';
declare class RecentAddressService implements IRecentAddressService {
    create(data: CreateRecentAddress): Promise<RecentAddress>;
    getAll(userId: number): Promise<RecentAddress[]>;
    delete(id: number): Promise<void>;
}
declare const recentAddressService: RecentAddressService;
export default recentAddressService;
