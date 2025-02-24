import { Request, Response, NextFunction } from 'express';
import chatService from '../services/chatService';
import CustomRequest from '../interfaces/customRequest';
import response from '../utils/response';
import { serializeChats } from '../utils/serialization/chat.serialization';

class ChatController {
  async openChat(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, role } = req as CustomRequest;
      const chat = await chatService.openChat({
        ...req.body,
        [`${role.toLowerCase()}Id`]: user, // this will update the driverId or userId with the current user id for better data integrity
      });
      response(res, 201, {
        status: true,
        message: 'Chat opened successfully',
        result: chat,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, role } = req as CustomRequest;
      const { data, pagination } = await chatService.getAll(
        req.query,
        role,
        user,
      );
      response(res, 200, {
        status: true,
        message: 'Chats fetched successfully',
        pagination,
        result: serializeChats(data),
      });
    } catch (error) {
      next(error);
    }
  }
}

const chatController = new ChatController();
export default chatController;
