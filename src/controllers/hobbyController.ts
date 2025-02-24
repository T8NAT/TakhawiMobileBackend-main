import { Request, Response, NextFunction } from 'express';
import hobbyService from '../services/hobbyService';
import {
  serializeHobby,
  serializeHobbies,
} from '../utils/serialization/hobbies.serialization';
import response from '../utils/response';
import CustomRequest from '../interfaces/customRequest';

class HobbyController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const hobby = await hobbyService.create(req.body);
      response(res, 201, {
        status: true,
        message: 'Hobby created successfully',
        result: hobby,
      });
    } catch (error) {
      next(error);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const hobby = await hobbyService.getOne(+req.params.id);
      const { language, skipLang } = req as CustomRequest;
      response(res, 200, {
        status: true,
        message: 'Hobby fetched successfully',
        result: skipLang ? hobby : serializeHobby(hobby, language),
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const hoppies = await hobbyService.getAll(req.query);
      const { language, skipLang } = req as CustomRequest;
      response(res, 200, {
        status: true,
        message: 'Hoppies fetched successfully',
        pagination: hoppies.pagination,
        result: skipLang
          ? hoppies.data
          : serializeHobbies(hoppies.data, language),
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const hobby = await hobbyService.update(+req.params.id, req.body);
      response(res, 200, {
        status: true,
        message: 'Hobby updated successfully',
        result: hobby,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await hobbyService.delete(+req.params.id);
      response(res, 204, {
        status: true,
        message: 'Hobby deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

const hobbyController = new HobbyController();
export default hobbyController;
