import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
declare function joiMiddleWare(schema: Joi.ObjectSchema<any>, location?: 'body' | 'query'): (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare function joiAsyncMiddleWare(schema: Joi.ObjectSchema<any>, location?: 'body' | 'query'): (req: Request, res: Response, next: NextFunction) => Promise<void>;
export default joiMiddleWare;
