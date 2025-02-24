import { QueryType } from '../types/queryType';

export interface IFavoriteDriverService {
  addToFavorite(userId: number, driverId: number): Promise<void>;
  removeFromFavorite(userId: number, driverId: number): Promise<void>;
  getFavoriteDrivers(userId: number, query: QueryType);
}
