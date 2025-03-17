import Joi from 'joi';
import { CreateSettlementRequest } from '../types/settlementRequestType';
export declare const createSettlementRequestSchema: Joi.ObjectSchema<CreateSettlementRequest>;
export declare const settlementRequestQuerySchema: Joi.ObjectSchema<Partial<import("../types/queryType").QueryType & {
    status: string;
}>>;
