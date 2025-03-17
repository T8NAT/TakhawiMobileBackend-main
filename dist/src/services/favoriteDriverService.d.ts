import { IFavoriteDriverService } from '../interfaces/favoriteDriverService';
import { QueryType } from '../types/queryType';
declare class FavoriteDriverService implements IFavoriteDriverService {
    addToFavorite(userId: number, driverId: number): Promise<void>;
    removeFromFavorite(userId: number, driverId: number): Promise<void>;
    getFavoriteDrivers(userId: number, query: QueryType): Promise<{
        data: unknown;
        pagination: {
            totalPages: number;
            totalItems: number;
            page: number;
            limit: number;
        };
    }>;
}
declare const favoriteDriverService: FavoriteDriverService;
export default favoriteDriverService;
