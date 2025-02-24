import { Request, Response, NextFunction } from 'express';
import recentAddressService from '../services/recentAddressService';
import CustomRequest from '../interfaces/customRequest';
import response from '../utils/response';

class RecentAddressController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req as CustomRequest;
      const recentAddress = await recentAddressService.create({
        ...req.body,
        userId: user,
      });
      response(res, 201, {
        status: true,
        message: 'Recent address created successfully',
        result: recentAddress,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req as CustomRequest;
      const recentAddresses = await recentAddressService.getAll(user);
      response(res, 200, {
        status: true,
        message: 'Recent addresses fetched successfully',
        result: recentAddresses,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await recentAddressService.delete(+id);
      response(res, 200, {
        status: true,
        message: 'Recent address deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

const recentAddressController = new RecentAddressController();
export default recentAddressController;
