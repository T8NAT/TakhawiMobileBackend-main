import { Request, Response, NextFunction } from 'express';
import walletService from '../services/walletService';
import response from '../utils/response';
import CustomRequest from '../interfaces/customRequest';
import { customEventEmitter } from '../utils/event-listner';

class WalletController {
  async getUserWalletHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const queryString = req.query;
      const { user } = req as CustomRequest;
      const data = await walletService.getUserWalletHistory(user, queryString);
      response(res, 200, {
        status: true,
        message: 'User wallet history fetched successfully',
        pagination: data.pagination,
        result: data.data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getDriverWalletHistory(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const queryString = req.query;
      const { user } = req as CustomRequest;
      const data = await walletService.getDriverWalletHistory(
        user,
        queryString,
      );
      response(res, 200, {
        status: true,
        message: 'Driver wallet history fetched successfully',
        pagination: data.pagination,
        result: data.data,
      });
    } catch (error) {
      next(error);
    }
  }

  async walletRecharge(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req as CustomRequest;
      const { notification, ...result } = await walletService.walletRecharge({
        ...req.body,
        userId: user,
      });
      response(res, 200, {
        status: true,
        message: 'Wallet recharged successfully',
        result,
      });
      customEventEmitter.emit('notification', notification);
    } catch (error) {
      next(error);
    }
  }
}

const walletController = new WalletController();
export default walletController;
