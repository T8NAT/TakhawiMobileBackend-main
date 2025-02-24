import { Request, Response, NextFunction } from 'express';
import cityService from '../services/cityService';
import response from '../utils/response';
import {
  serializeCity,
  serializeCities,
} from '../utils/serialization/city.serialization';
import CustomRequest from '../interfaces/customRequest';

class CityController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const city = await cityService.create(req.body);
      response(res, 201, {
        status: true,
        message: 'City created successfully',
        result: city,
      });
    } catch (error) {
      next(error);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const city = await cityService.getOne(+req.params.id);
      const { language, skipLang } = req as CustomRequest;
      response(res, 200, {
        status: true,
        message: 'City feched successfully',
        result: skipLang ? city : serializeCity(city, language),
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const cities = await cityService.getAll(req.query);
      const { language, skipLang } = req as CustomRequest;
      response(res, 200, {
        status: true,
        message: 'Cities fetched successfully',
        pagination: cities.pagination,
        result: skipLang ? cities.data : serializeCities(cities.data, language),
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const city = await cityService.update(+req.params.id, req.body);
      response(res, 200, {
        status: true,
        message: 'City updated successfully',
        result: city,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await cityService.delete(+req.params.id);
      response(res, 204, {
        status: true,
        message: 'City deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

const cityController = new CityController();
export default cityController;
