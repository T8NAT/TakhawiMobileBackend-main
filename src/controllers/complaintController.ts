import { Request, Response, NextFunction } from 'express';
import complaintService from '../services/complaintService';
import response from '../utils/response';
import CustomRequest from '../interfaces/customRequest';
import { Roles } from '../enum/roles';

class ComplaintController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as CustomRequest).user;
      req.body.userId = userId;
      const complaint = await complaintService.create(req.body);
      return response(res, 201, {
        status: true,
        message: 'Complaint created successfully',
        result: complaint,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const complaints = await complaintService.getAll(req.query);
      return response(res, 200, {
        status: true,
        message: 'Complaints fetched successfully',
        pagination: complaints.pagination,
        result: complaints.data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, role } = req as CustomRequest;
      const complaint = await complaintService.getOne(
        +req.params.id,
        role === Roles.USER || role === Roles.DRIVER ? user : undefined,
      );
      return response(res, 200, {
        status: true,
        message: 'Complaint fetched successfully',
        result: complaint,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, role } = req as CustomRequest;
      const complaint = await complaintService.update(
        +req.params.id,
        req.body,
        role === Roles.USER || role === Roles.DRIVER ? user : undefined,
      );
      return response(res, 200, {
        status: true,
        message: 'Complaint updated successfully',
        result: complaint,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, role } = req as CustomRequest;
      await complaintService.delete(
        +req.params.id,
        role === Roles.USER || role === Roles.DRIVER ? user : undefined,
      );
      return response(res, 204, {
        status: true,
        message: 'Complaint deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

const complaintController = new ComplaintController();
export default complaintController;
