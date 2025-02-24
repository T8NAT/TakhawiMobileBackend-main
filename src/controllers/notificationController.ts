import { Request, Response, NextFunction } from 'express';
import notificationService from '../services/notificationService';
import response from '../utils/response';
import CustomRequest from '../interfaces/customRequest';
import { serializeNotifications } from '../utils/serialization/notification.serialization';

class NotificationController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const notification = await notificationService.create(req.body);
      response(res, 201, {
        status: true,
        message: 'Notification created successfully',
        result: notification,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, language } = req as CustomRequest;
      const data = await notificationService.getAll(req.query, user);
      response(res, 200, {
        status: true,
        message: 'Notifications retrieved successfully',
        pagination: data.pagination,
        result: serializeNotifications(data.data, language),
      });
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { user } = req as CustomRequest;
      await notificationService.markAsRead(+id, user);
      response(res, 200, {
        status: true,
        message: 'Notification marked as read successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async markAllAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req as CustomRequest;
      await notificationService.markAllAsRead(user);
      response(res, 200, {
        status: true,
        message: 'All notifications marked as read successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { user } = req as CustomRequest;
      await notificationService.delete(Number(id), user);
      response(res, 200, {
        status: true,
        message: 'Notification deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async sendNotification(req: Request, res: Response, next: NextFunction) {
    try {
      await notificationService.sendNotification(req.body);
      response(res, 200, {
        status: true,
        message: 'Notification sent successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

const notificationController = new NotificationController();
export default notificationController;
