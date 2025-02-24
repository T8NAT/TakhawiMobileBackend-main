import Joi from 'joi';
import { CreateChat, ChatQuery } from '../types/chatType';
import { CreateMessage, MessageQuery } from '../types/messageType';
import { ContentType } from '../enum/chat';

export const openChatSchema = Joi.object<CreateChat>().keys({
  tripId: Joi.number().strict().required(),
  userId: Joi.when('driverId', {
    is: Joi.exist(),
    then: Joi.forbidden(),
    otherwise: Joi.number().strict().required(),
  }),
  driverId: Joi.number().strict().optional(),
});

export const sendMessageSchema = Joi.object<CreateMessage>().keys({
  chatId: Joi.string().required(),
  content: Joi.string().when('contentType', {
    is: Joi.valid(ContentType.TEXT),
    then: Joi.required(),
    otherwise: Joi.forbidden(),
  }),
  contentType: Joi.string()
    .valid(...Object.values(ContentType))
    .optional(),
});

export const getAllChatSchema = Joi.object<ChatQuery>().keys({
  page: Joi.number().strict().optional(),
  limit: Joi.number().strict().optional(),
});

export const getAllMessageSchema = Joi.object<MessageQuery>().keys({
  page: Joi.number().strict().optional(),
  limit: Joi.number().strict().optional(),
});
