"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __importDefault(require("../../prisma/client"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const paymentGatewayService_1 = __importDefault(require("./paymentGatewayService"));
class SavedCardService {
    async create(userId) {
        const user = await client_1.default.user.findUnique({
            where: { id: userId },
            select: {
                email: true,
                name: true,
                uuid: true,
                City: {
                    select: {
                        en_name: true,
                        postcode: true,
                    },
                },
                User_Billing_Info: {
                    select: {
                        state: true,
                        street: true,
                        surname: true,
                    },
                },
            },
        });
        if (!user || !user.City || !user.User_Billing_Info)
            throw new ApiError_1.default('User details not found', 404);
        const data = {
            email: user.email,
            city: user.City.en_name,
            givenName: user.name,
            postcode: user.City.postcode,
            state: user.User_Billing_Info.state,
            street1: user.User_Billing_Info.street,
            surname: user.User_Billing_Info.surname,
            recurringAgreementId: `${user.uuid.substring(0, 8)}-${new Date().getTime()}`,
        };
        const { id } = await paymentGatewayService_1.default.prepareCheckoutCredit(data);
        return id;
    }
    async getOne(id, user_id) {
        const card = await client_1.default.saved_Card.findUnique({
            where: {
                id,
                user_id,
                deletedAt: null,
            },
        });
        if (!card)
            throw new ApiError_1.default('Card not found', 404);
        return card;
    }
    async delete(id, user_id) {
        const card = await client_1.default.saved_Card.findUnique({
            where: {
                id,
                user_id,
                deletedAt: null,
            },
            select: {
                id: true,
                token: true,
            },
        });
        if (!card)
            throw new ApiError_1.default('Card not found', 404);
        await paymentGatewayService_1.default.deleteRegistration(card.token);
        await client_1.default.saved_Card.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
    async getAll(userId) {
        return client_1.default.saved_Card.findMany({
            where: {
                user_id: userId,
                deletedAt: null,
            },
            select: {
                id: true,
                user_id: true,
                card_number: true,
                card_holder: true,
                card_exp_month: true,
                card_exp_year: true,
                payment_brand: true,
                createdAt: true,
                updatedAt: true,
                deletedAt: true,
            },
        });
    }
    async createUserBillingInfo(data) {
        const city = await client_1.default.city.findUnique({ where: { id: data.cityId } });
        if (!city)
            throw new ApiError_1.default('City not found', 404);
        await client_1.default.user_Billing_Info.upsert({
            where: {
                userId: data.userId,
            },
            create: {
                state: data.state,
                street: data.street,
                surname: data.surname,
                userId: data.userId,
            },
            update: {
                state: data.state,
                street: data.street,
                surname: data.surname,
            },
        });
        await client_1.default.user.update({
            where: { id: data.userId },
            data: {
                cityId: data.cityId,
            },
        });
    }
    async getUserBillingInfo(userId) {
        const userBillingInfo = await client_1.default.user_Billing_Info.findUnique({
            where: { userId },
        });
        if (!userBillingInfo)
            throw new ApiError_1.default('User billing info not found', 404);
        return userBillingInfo;
    }
}
const savedCardService = new SavedCardService();
exports.default = savedCardService;
