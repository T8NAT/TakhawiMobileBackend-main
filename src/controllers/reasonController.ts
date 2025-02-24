import { Request, Response, NextFunction } from 'express';
import response from '../utils/response';
import reasonService from '../services/reasonService';
import {
  serializeReason,
  serializeReasons,
} from '../utils/serialization/reason.serialization';
import CustomRequest from '../interfaces/customRequest';

class ReasonController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const reason = await reasonService.create(req.body);
      return response(res, 201, {
        status: true,
        message: 'Reason created successfully',
        result: reason,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const reasons = await reasonService.getAll();
      const { language, skipLang } = req as CustomRequest;
      return response(res, 200, {
        status: true,
        message: 'Reasons fetched successfully',
        result: skipLang ? reasons : serializeReasons(reasons, language),
      });
    } catch (error) {
      next(error);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const reason = await reasonService.getOne(+req.params.id);
      const { language, skipLang } = req as CustomRequest;
      return response(res, 200, {
        status: true,
        message: 'Reason fetched successfully',
        result: skipLang ? reason : serializeReason(reason, language),
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const reason = await reasonService.update(+req.params.id, req.body);
      return response(res, 200, {
        status: true,
        message: 'Reason updated successfully',
        result: reason,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await reasonService.delete(+req.params.id);
      return response(res, 204, {
        status: true,
        message: 'Reason deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

const reasonController = new ReasonController();
export default reasonController;
