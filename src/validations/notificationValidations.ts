import Joi from 'joi';
import { CreateNotification } from '../types/notificationType';
import { NotificationTypes } from '../enum/notification';
import { SendNotificationType } from '../types/notificationTokenType';

export const createNotificationSchema = Joi.object<CreateNotification>().keys({
  ar_title: Joi.string().required(),
  ar_body: Joi.string().required(),
  en_title: Joi.string().required(),
  en_body: Joi.string().required(),
  type: Joi.string().valid(NotificationTypes.COUPON).required(),
  userId: Joi.number().strict().required(),
});

export const sendNotificationSchema = Joi.object<SendNotificationType>().keys({
  body: Joi.string().required(),
  title: Joi.string().required(),
  imageUrl: Joi.string().optional(),
  userIds: Joi.array().items(Joi.number()).optional(),
});
