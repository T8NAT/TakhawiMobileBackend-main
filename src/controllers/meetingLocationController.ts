import { Request, Response, NextFunction } from 'express';
import response from '../utils/response';
import meetingLocationService from '../services/mettingLocationService';
import CustomRequest from '../interfaces/customRequest';
import {
  serializeMeetingLocation,
  serializeMeetingLocations,
} from '../utils/serialization/meetingLocation.serialization';

class MeetingLocationController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const meetingLocation = await meetingLocationService.create(req.body);
      response(res, 201, {
        status: true,
        message: 'Meeting location created successfully',
        result: meetingLocation,
      });
    } catch (error) {
      next(error);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const meetingLocation = await meetingLocationService.getOne(
        +req.params.id,
      );
      const { language, skipLang } = req as CustomRequest;
      response(res, 200, {
        status: true,
        message: 'Meeting location fetched successfully',
        result: skipLang
          ? meetingLocation
          : serializeMeetingLocation(meetingLocation, language),
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const meetingLocations = await meetingLocationService.getAll();
      const { language, skipLang } = req as CustomRequest;
      response(res, 200, {
        status: true,
        message: 'Meeting locations fetched successfully',
        result: skipLang
          ? meetingLocations
          : serializeMeetingLocations(meetingLocations, language),
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const meetingLocation = await meetingLocationService.update(
        +req.params.id,
        req.body,
      );
      response(res, 200, {
        status: true,
        message: 'Meeting location updated successfully',
        result: meetingLocation,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await meetingLocationService.delete(+req.params.id);
      response(res, 204, {
        status: true,
        message: 'Meeting location deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

const meetingLocationController = new MeetingLocationController();
export default meetingLocationController;
