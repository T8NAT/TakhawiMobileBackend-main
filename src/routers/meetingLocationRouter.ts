import { Router } from 'express';
import meetingLocationController from '../controllers/meetingLocationController';
import joiMiddleWare from '../middlewares/joiMiddleware';
import {
  createMeetingLocationValidations,
  updateMeetingLocationValidations,
} from '../validations/meetingLocationValidations';

const router = Router();

router
  .route('/')
  .get(meetingLocationController.getAll)
  .post(
    joiMiddleWare(createMeetingLocationValidations),
    meetingLocationController.create,
  );

router
  .route('/:id')
  .get(meetingLocationController.getOne)
  .patch(
    joiMiddleWare(updateMeetingLocationValidations),
    meetingLocationController.update,
  )
  .delete(meetingLocationController.delete);

export default router;
