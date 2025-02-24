import { Request, Response, NextFunction } from 'express';
import response from '../utils/response';
import warningService from '../services/warningService';
import { customEventEmitter } from '../utils/event-listner';
import {
  serializeWarning,
  serializeWarnings,
} from '../utils/serialization/warnings.serialization';
import CustomRequest from '../interfaces/customRequest';

class WarningController {
  async getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { language } = req as CustomRequest;
      const warning = await warningService.getOne(+req.params.id);
      response(res, 200, {
        status: true,
        message: 'Warning found',
        result: serializeWarning(warning, language),
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const warning = await warningService.create(req.body);
      customEventEmitter.emit('newWarning', warning);
      response(res, 201, {
        status: true,
        message: 'Warning created',
        result: warning,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await warningService.delete(Number(req.params.id));
      response(res, 204, {
        status: true,
        message: 'Warning deleted',
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { language } = req as CustomRequest;
      const warnings = await warningService.getAll(req.query);
      response(res, 200, {
        status: true,
        message: 'Warnings found',
        result: serializeWarnings(warnings, language),
      });
    } catch (error) {
      next(error);
    }
  }
}

const warningController = new WarningController();
export default warningController;
