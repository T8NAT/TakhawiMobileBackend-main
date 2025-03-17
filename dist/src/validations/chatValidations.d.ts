import Joi from 'joi';
import { CreateChat } from '../types/chatType';
import { CreateMessage } from '../types/messageType';
export declare const openChatSchema: Joi.ObjectSchema<CreateChat>;
export declare const sendMessageSchema: Joi.ObjectSchema<CreateMessage>;
export declare const getAllChatSchema: Joi.ObjectSchema<Partial<import("../types/queryType").QueryType>>;
export declare const getAllMessageSchema: Joi.ObjectSchema<Partial<import("../types/queryType").QueryType>>;
