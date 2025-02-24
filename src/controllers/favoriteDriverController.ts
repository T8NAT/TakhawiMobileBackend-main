import { Request, Response, NextFunction } from 'express';
import favoriteDriverService from '../services/favoriteDriverService';
import response from '../utils/response';
import CustomRequest from '../interfaces/customRequest';

class FavoriteDriverController {
  async addToFavorite(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req as CustomRequest;
      await favoriteDriverService.addToFavorite(user, +req.params.driverId);
      response(res, 200, {
        status: true,
        message: 'Driver added to favorites',
      });
    } catch (error) {
      next(error);
    }
  }

  async removeFromFavorite(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req as CustomRequest;
      await favoriteDriverService.removeFromFavorite(
        user,
        +req.params.driverId,
      );
      response(res, 200, {
        status: true,
        message: 'Driver removed from favorites',
      });
    } catch (error) {
      next(error);
    }
  }

  async getFavoriteDrivers(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req as CustomRequest;
      const { data, pagination } =
        await favoriteDriverService.getFavoriteDrivers(user, req.query);
      response(res, 200, {
        status: true,
        message: 'Favorite drivers fetched',
        pagination,
        result: data,
      });
    } catch (error) {
      next(error);
    }
  }
}

const favoriteDriverController = new FavoriteDriverController();
export default favoriteDriverController;
