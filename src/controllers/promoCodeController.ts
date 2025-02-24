import { Request, Response, NextFunction } from 'express';
import promoCodeService from '../services/promoCodeService';
import response from '../utils/response';
import CustomRequest from '../interfaces/customRequest';

class PromoCodeController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const promoCode = await promoCodeService.create(req.body);
      response(res, 201, {
        status: true,
        message: 'Promo code created successfully',
        result: promoCode,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const promoCodes = await promoCodeService.getAll(req.query);
      response(res, 200, {
        status: true,
        message: 'Promo codes fetched successfully',
        pagination: promoCodes.pagination,
        result: promoCodes.data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const promoCode = await promoCodeService.getOne(+req.params.id);
      response(res, 200, {
        status: true,
        message: 'Promo code fetched successfully',
        result: promoCode,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const promoCode = await promoCodeService.update(+req.params.id, req.body);
      response(res, 200, {
        status: true,
        message: 'Promo code updated successfully',
        result: promoCode,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await promoCodeService.delete(+req.params.id);
      response(res, 204, {
        status: true,
        message: 'Promo code deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async checkPromoCode(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as CustomRequest).user;
      const promoCode = await promoCodeService.checkPromoCode(
        req.body.code,
        userId,
      );
      response(res, 200, {
        status: true,
        message: 'Promo code is valid',
        result: promoCode,
      });
    } catch (error) {
      next(error);
    }
  }
}

const promoCodeController = new PromoCodeController();
export default promoCodeController;
