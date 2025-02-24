import { CreateRecentAddress, RecentAddress } from '../types/recentAddressType';

export interface IRecentAddressService {
  create(data: CreateRecentAddress): Promise<RecentAddress>;
  getAll(userId: number): Promise<RecentAddress[]>;
  delete(id: number): Promise<void>;
}
