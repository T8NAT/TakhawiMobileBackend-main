import Joi from 'joi';
import { CreateNotification } from '../types/notificationType';
import { SendNotificationType } from '../types/notificationTokenType';
export declare const createNotificationSchema: Joi.ObjectSchema<CreateNotification>;
export declare const sendNotificationSchema: Joi.ObjectSchema<SendNotificationType>;
