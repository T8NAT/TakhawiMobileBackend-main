import { Router } from 'express';
import favoriteDriverController from '../controllers/favoriteDriverController';
import auth from '../middlewares/auth';

const router = Router();

router.use(auth);

router
  .route('/:driverId')
  .post(favoriteDriverController.addToFavorite)
  .delete(favoriteDriverController.removeFromFavorite);

router.route('/').get(favoriteDriverController.getFavoriteDrivers);

export default router;
