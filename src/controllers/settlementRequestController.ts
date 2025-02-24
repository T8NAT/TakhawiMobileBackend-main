import { Request, Response, NextFunction } from 'express';
import settlementRequestService from '../services/settlementRequestService';
import CustomRequest from '../interfaces/customRequest';
import response from '../utils/response';
import { Roles } from '../enum/roles';

class SettlementRequestService {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req as CustomRequest;
      const request = await settlementRequestService.create({
        ...req.body,
        user_id: user,
      });
      response(res, 201, {
        status: true,
        message: 'Settlement request created',
        result: request,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const requests = await settlementRequestService.getAll(req.query);
      response(res, 200, {
        status: true,
        message: 'Settlement requests fetched',
        result: requests,
      });
    } catch (error) {
      next(error);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, role } = req as CustomRequest;
      const request = await settlementRequestService.getOne(
        +req.params.id,
        role === Roles.DRIVER ? user : undefined,
      );
      response(res, 200, {
        status: true,
        message: 'Settlement request fetched',
        result: request,
      });
    } catch (error) {
      next(error);
    }
  }

  async cancel(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req as CustomRequest;
      await settlementRequestService.cancel(+req.params.id, user);
      response(res, 200, {
        status: true,
        message: 'Settlement request canceled',
      });
    } catch (error) {
      next(error);
    }
  }

  async approve(req: Request, res: Response, next: NextFunction) {
    try {
      await settlementRequestService.approve(+req.params.id);
      response(res, 200, {
        status: true,
        message: 'Settlement request approved',
      });
    } catch (error) {
      next(error);
    }
  }

  async deny(req: Request, res: Response, next: NextFunction) {
    try {
      await settlementRequestService.deny(+req.params.id);
      response(res, 200, {
        status: true,
        message: 'Settlement request denied',
      });
    } catch (error) {
      next(error);
    }
  }
}

const settlementRequestController = new SettlementRequestService();
export default settlementRequestController;
