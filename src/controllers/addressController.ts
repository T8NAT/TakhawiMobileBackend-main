import { Request, Response, NextFunction } from 'express';
import addressService from '../services/addressService';
import response from '../utils/response';
import CustomRequest from '../interfaces/customRequest';

class AddressController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as CustomRequest).user;
      const address = await addressService.create(req.body, userId);
      response(res, 201, {
        status: true,
        message: 'Address created successfully',
        result: address,
      });
    } catch (error) {
      next(error);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as CustomRequest).user;
      const address = await addressService.getOne(+req.params.id, userId);
      response(res, 200, {
        status: true,
        message: 'Address fetched successfully',
        result: address,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as CustomRequest).user;
      const addresses = await addressService.getAll(
        userId,
        req.query.is_favorite as string,
      );
      response(res, 200, {
        status: true,
        message: 'Addresses fetched successfully',
        result: addresses,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllAddresses(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.query.userId ? req.query.userId : undefined;
      const addresses = await addressService.getAllAddresses(
        req.query,
        +userId!,
      );
      response(res, 200, {
        status: true,
        message: 'Addresses fetched successfully',
        pagination: addresses.pagination,
        result: addresses.data,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as CustomRequest).user;
      const address = await addressService.update(
        +req.params.id,
        req.body,
        userId,
      );
      response(res, 200, {
        status: true,
        message: 'Address updated successfully',
        result: address,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as CustomRequest).user;
      await addressService.delete(+req.params.id, userId);
      response(res, 204, {
        status: true,
        message: 'Address deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

const addressController = new AddressController();
export default addressController;
