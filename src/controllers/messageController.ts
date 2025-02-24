import { Request, Response, NextFunction } from 'express';
import messageService from '../services/messagesService';
import CustomRequest from '../interfaces/customRequest';
import response from '../utils/response';
import { ContentType } from '../enum/chat';

class MessageController {
  async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req as CustomRequest;
      await messageService.sendMessage({
        ...req.body,
        content: req.file!.path,
        senderId: user,
      });
      response(res, 201, {
        status: true,
        message: 'Message sent successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { data, pagination } = await messageService.getAll(
        req.query,
        req.params.chatId,
      );
      response(res, 200, {
        status: true,
        message: 'Messages fetched successfully',
        pagination,
        result: data,
      });
    } catch (error) {
      next(error);
    }
  }

  async markAllAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req as CustomRequest;
      const { chatId } = req.params;
      await messageService.markAllAsRead(chatId, user);
      response(res, 200, {
        status: true,
        message: 'Messages marked as read successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

const messageController = new MessageController();
export default messageController;
