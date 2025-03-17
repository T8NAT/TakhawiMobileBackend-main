import { Request, Response, NextFunction } from 'express';
declare class FavoriteDriverController {
    addToFavorite(req: Request, res: Response, next: NextFunction): Promise<void>;
    removeFromFavorite(req: Request, res: Response, next: NextFunction): Promise<void>;
    getFavoriteDrivers(req: Request, res: Response, next: NextFunction): Promise<void>;
}
declare const favoriteDriverController: FavoriteDriverController;
export default favoriteDriverController;
