"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pug_1 = __importDefault(require("pug"));
const response_1 = __importDefault(require("../utils/response"));
const savedCardService_1 = __importDefault(require("../services/savedCardService"));
class SavedCardController {
    async create(req, res, next) {
        try {
            const { user } = req;
            const checkoutId = await savedCardService_1.default.create(user);
            const serverDomain = `${req.protocol}://${req.get('host')}`;
            const paymentGatewayDomain = process.env.PAYMENT_GATEWAY_DOMAIN;
            const html = pug_1.default.renderFile(`${process.cwd()}/src/templates/createCard.pug`, {
                checkoutId, userId: user, serverDomain, paymentGatewayDomain,
            });
            res.send(html);
        }
        catch (error) {
            next(error);
        }
    }
    async getAll(req, res, next) {
        try {
            const { user } = req;
            const cards = await savedCardService_1.default.getAll(user);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Cards retrieved successfully',
                result: cards,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            const { user } = req;
            await savedCardService_1.default.delete(+req.params.id, user);
            (0, response_1.default)(res, 204, {
                status: true,
                message: 'Card deleted successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
    async createUserBillingInfo(req, res, next) {
        try {
            const { user } = req;
            const userBillingInfo = await savedCardService_1.default.createUserBillingInfo({ ...req.body, userId: user });
            (0, response_1.default)(res, 201, {
                status: true,
                message: 'User billing info created successfully',
                result: userBillingInfo,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getUserBillingInfo(req, res, next) {
        try {
            const { user } = req;
            const userBillingInfo = await savedCardService_1.default.getUserBillingInfo(user);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'User billing info retrieved successfully',
                result: userBillingInfo,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
const savedCardController = new SavedCardController();
exports.default = savedCardController;
