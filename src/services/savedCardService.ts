import prisma from '../../prisma/client';
import { ISavedCardService } from '../interfaces/savedCardService';
import {
  CreateUserBillingInfo,
  UserBillingType,
} from '../types/paymentGatewayType';
import { SavedCardType } from '../types/savedCardType';
import ApiError from '../utils/ApiError';
import paymentGatewayService from './paymentGatewayService';

class SavedCardService implements ISavedCardService {
  async create(userId: number): Promise<string> {
    const user = await prisma.user.findUnique({
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
      throw new ApiError('User details not found', 404);
    const data: UserBillingType = {
      email: user.email,
      city: user.City.en_name,
      givenName: user.name,
      postcode: user.City.postcode!,
      state: user.User_Billing_Info.state,
      street1: user.User_Billing_Info.street,
      surname: user.User_Billing_Info.surname,
      recurringAgreementId: `${user.uuid.substring(0, 8)}-${new Date().getTime()}`,
    };

    const { id } = await paymentGatewayService.prepareCheckoutCredit(data);
    return id;
  }

  async getOne(id: number, user_id: number): Promise<SavedCardType> {
    const card = await prisma.saved_Card.findUnique({
      where: {
        id,
        user_id,
        deletedAt: null,
      },
    });
    if (!card) throw new ApiError('Card not found', 404);
    return card;
  }

  async delete(id: number, user_id: number): Promise<void> {
    const card = await prisma.saved_Card.findUnique({
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
    if (!card) throw new ApiError('Card not found', 404);
    await paymentGatewayService.deleteRegistration(card.token);
    await prisma.saved_Card.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async getAll(
    userId: number,
  ): Promise<
    Omit<
      SavedCardType,
      'token' | 'recurringAgreementId' | 'initialTransactionId'
    >[]
  > {
    return prisma.saved_Card.findMany({
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

  async createUserBillingInfo(data: CreateUserBillingInfo): Promise<void> {
    const city = await prisma.city.findUnique({ where: { id: data.cityId } });
    if (!city) throw new ApiError('City not found', 404);
    await prisma.user_Billing_Info.upsert({
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

    await prisma.user.update({
      where: { id: data.userId },
      data: {
        cityId: data.cityId,
      },
    });
  }

  async getUserBillingInfo(userId: number) {
    const userBillingInfo = await prisma.user_Billing_Info.findUnique({
      where: { userId },
    });
    if (!userBillingInfo)
      throw new ApiError('User billing info not found', 404);
    return userBillingInfo;
  }
}

const savedCardService = new SavedCardService();
export default savedCardService;
