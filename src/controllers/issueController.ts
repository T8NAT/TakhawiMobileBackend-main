import { Request, Response, NextFunction } from 'express';
import issueService from '../services/issueService';
import response from '../utils/response';
import CustomRequest from '../interfaces/customRequest';

class IssueController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as CustomRequest).user;
      req.body.userId = userId;
      const issue = await issueService.create(req.body);
      response(res, 201, {
        status: true,
        message: 'Issue created successfully',
        result: issue,
      });
    } catch (error) {
      next(error);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const issue = await issueService.getOne(+req.params.id);
      response(res, 200, {
        status: true,
        message: 'Issue fetched successfully',
        result: issue,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { role } = req as CustomRequest;
      const userId = (req as CustomRequest).user;
      const issues = await issueService.getAll(userId, role, req.query);
      response(res, 200, {
        status: true,
        message: 'Issues fetched successfully',
        pagination: issues.pagination,
        result: issues.data,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const issue = await issueService.update(+req.params.id, req.body);
      response(res, 200, {
        status: true,
        message: 'Issue updated successfully',
        result: issue,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await issueService.delete(+req.params.id);
      response(res, 204, {
        status: true,
        message: 'Issue deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

const issueController = new IssueController();
export default issueController;
