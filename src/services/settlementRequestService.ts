import prisma from '../../prisma/client';
import ISettlementRequestService from '../interfaces/settlementService';
import ISettlementRequest, {
  CreateSettlementRequest,
  SettlementRequestQuery,
} from '../types/settlementRequestType';
import { PaginateType } from '../types/paginateType';
import { paginate } from '../utils/pagination';
import ApiError from '../utils/ApiError';
import { SettlementRequestStatus } from '../enum/settlementRequest';
import { TransactionType } from '../enum/wallet';

class SettlementRequestService implements ISettlementRequestService {
  // TODO: Make trip_id optional
  async create(data: CreateSettlementRequest): Promise<ISettlementRequest> {
    const user = await prisma.user.findUnique({
      where: {
        id: data.user_id,
      },
      select: {
        driver_wallet_balance: true,
      },
    });
    if (user?.driver_wallet_balance! < data.amount)
      throw new ApiError('Insufficient balance', 400);
    const [request] = await prisma.$transaction([
      prisma.settlement_Request.create({ data }),
      prisma.user.update({
        where: { id: data.user_id },
        data: {
          driver_wallet_balance: { decrement: data.amount },
          Driver_Wallet_Transaction: {
            create: {
              amount: -data.amount,
              previous_balance: user!.driver_wallet_balance,
              current_balance: user!.driver_wallet_balance - data.amount,
              transaction_type: TransactionType.SETTLEMENT_REQUEST,
            },
          },
        },
      }),
    ]);
    return request;
  }

  async getAll(
    query: SettlementRequestQuery,
  ): Promise<PaginateType<ISettlementRequest>> {
    return paginate(
      'settlement_Request',
      {
        where: {
          status: query.status,
        },
      },
      query.page,
      query.limit,
    );
  }

  async getOne(id: number, userId?: number): Promise<ISettlementRequest> {
    const request = await prisma.settlement_Request.findUnique({
      where: { id, user_id: userId },
      include: {
        User: {
          select: {
            id: true,
            email: true,
            name: true,
            phone: true,
            avatar: true,
          },
        },
      },
    });
    if (!request) throw new ApiError('Settlement request not found', 404);
    return request;
  }

  async cancel(id: number, userId: number): Promise<void> {
    const request = await this.checkRequest(id, userId);
    await prisma.$transaction([
      prisma.settlement_Request.update({
        where: { id },
        data: { status: SettlementRequestStatus.CANCELED },
      }),
      prisma.user.update({
        where: { id: request.user_id },
        data: {
          driver_wallet_balance: { increment: request.amount },
          Driver_Wallet_Transaction: {
            create: {
              amount: request.amount,
              previous_balance: request.User!.driver_wallet_balance!,
              current_balance:
                request.User!.driver_wallet_balance! + request.amount,
              transaction_type: TransactionType.SETTLEMENT_REQUEST_CANCEL,
            },
          },
        },
      }),
    ]);
  }

  async approve(id: number, userId?: number): Promise<void> {
    await this.checkRequest(id, userId);
    await prisma.settlement_Request.update({
      where: { id },
      data: { status: SettlementRequestStatus.COMPLETED },
    });
  }

  async deny(id: number, userId?: number): Promise<void> {
    const request = await this.checkRequest(id, userId);
    await prisma.$transaction([
      prisma.settlement_Request.update({
        where: { id },
        data: { status: SettlementRequestStatus.DENIED },
      }),
      prisma.user.update({
        where: { id: request.user_id },
        data: {
          driver_wallet_balance: { increment: request.amount },
          Driver_Wallet_Transaction: {
            create: {
              amount: request.amount,
              previous_balance: request.User!.driver_wallet_balance!,
              current_balance:
                request.User!.driver_wallet_balance! + request.amount,
              transaction_type: TransactionType.SETTLEMENT_REQUEST_DENY,
            },
          },
        },
      }),
    ]);
  }

  private async checkRequest(
    id: number,
    userId?: number,
  ): Promise<ISettlementRequest> {
    const request = await prisma.settlement_Request.findUnique({
      where: {
        id,
        user_id: userId,
        status: SettlementRequestStatus.PENDING,
      },
      include: {
        User: {
          select: {
            driver_wallet_balance: true,
          },
        },
      },
    });
    if (!request)
      throw new ApiError('Settlement request not valid for this action', 404);
    return request;
  }
}

const settlementRequestService = new SettlementRequestService();
export default settlementRequestService;
