import { Request, Response, NextFunction } from 'express';
import pug from 'pug';
import CustomRequest from '../interfaces/customRequest';
import response from '../utils/response';
import savedCardService from '../services/savedCardService';

class SavedCardController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req as CustomRequest;
      const checkoutId = await savedCardService.create(user);
      const serverDomain = `${req.protocol}://${req.get('host')}`;
      const paymentGatewayDomain = process.env.PAYMENT_GATEWAY_DOMAIN;
      const html = pug.renderFile(
        `${process.cwd()}/src/templates/createCard.pug`,
        {
          checkoutId,
          userId: user,
          serverDomain,
          paymentGatewayDomain,
        },
      );
      res.send(html);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req as CustomRequest;
      const cards = await savedCardService.getAll(user);
      response(res, 200, {
        status: true,
        message: 'Cards retrieved successfully',
        result: cards,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req as CustomRequest;
      await savedCardService.delete(+req.params.id, user);
      response(res, 204, {
        status: true,
        message: 'Card deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async createUserBillingInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req as CustomRequest;
      const userBillingInfo = await savedCardService.createUserBillingInfo({
        ...req.body,
        userId: user,
      });
      response(res, 201, {
        status: true,
        message: 'User billing info created successfully',
        result: userBillingInfo,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserBillingInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req as CustomRequest;
      const userBillingInfo = await savedCardService.getUserBillingInfo(user);
      response(res, 200, {
        status: true,
        message: 'User billing info retrieved successfully',
        result: userBillingInfo,
      });
    } catch (error) {
      next(error);
    }
  }
}

const savedCardController = new SavedCardController();
export default savedCardController;
