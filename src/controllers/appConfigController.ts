import { Request, Response, NextFunction } from 'express';
import response from '../utils/response';
import appConfigService from '../services/appconfigService';
import ApiError from '../utils/ApiError';

class AppConfigController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.body.type === 'IMAGE') {
        if (!req.file) {
          throw new ApiError('Please upload a file', 400);
        }
        req.body.value = req.file.path;
      }
      const appConfig = await appConfigService.create(req.body);
      response(res, 201, {
        status: true,
        message: 'AppConfig created successfully',
        result: appConfig,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const appConfigs = await appConfigService.getAll(
        req.query.type as string,
      );
      response(res, 200, {
        status: true,
        message: 'All appConfigs fetched successfully',
        result: appConfigs,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await appConfigService.delete(+req.params.id);
      response(res, 204, {
        status: true,
        message: 'AppConfig deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

const appConfigController = new AppConfigController();
export default appConfigController;
