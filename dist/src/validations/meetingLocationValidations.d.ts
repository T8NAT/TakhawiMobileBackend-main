import Joi from 'joi';
import { CreateMeetingLocation } from '../types/meetingLocationType';
export declare const createMeetingLocationValidations: Joi.ObjectSchema<CreateMeetingLocation>;
export declare const updateMeetingLocationValidations: Joi.ObjectSchema<Partial<CreateMeetingLocation>>;
