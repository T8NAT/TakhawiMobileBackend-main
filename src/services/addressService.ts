import { IAddressService } from '../interfaces/addressService';
import {
  Address,
  AddressQueryType,
  CreateAddress,
  UpdateAddress,
} from '../types/address';
import prisma from '../../prisma/client';
import ApiError from '../utils/ApiError';
import { paginate } from '../utils/pagination';
import { PaginateType } from '../types/paginateType';

class AddressService implements IAddressService {
  async create(data: CreateAddress, userId: number): Promise<Address> {
    return prisma.address.upsert({
      where: {
        Unique_Address: {
          lat: data.lat,
          lng: data.lng,
          userId,
        },
      },
      update: data,
      create: {
        ...data,
        userId,
      },
    });
  }

  async getOne(id: number, userId: number): Promise<Address> {
    const address = await prisma.address.findUnique({
      where: {
        id,
        deletedAt: null,
        userId,
      },
    });
    if (!address) throw new ApiError('Address not found', 404);
    return address;
  }

  async getAll(userId: number, is_favorite?: string): Promise<Address[]> {
    return prisma.address.findMany({
      where: {
        userId,
        deletedAt: null,
        is_favorite: is_favorite ? is_favorite === 'true' : undefined,
      },
    });
  }

  async getAllAddresses(
    queryString: AddressQueryType,
    userId?: number,
  ): Promise<PaginateType<Address>> {
    if (userId) {
      return paginate(
        'address',
        { where: { userId, deletedAt: null } },
        queryString.page,
        queryString.limit,
      );
    }
    return paginate('address', { where: { deletedAt: null } });
  }

  async update(
    id: number,
    data: UpdateAddress,
    userId: number,
  ): Promise<Address> {
    await this.getOne(id, userId);
    return prisma.address.update({
      where: {
        id,
        userId,
      },
      data,
    });
  }

  async delete(id: number, userId: number): Promise<void> {
    await this.getOne(id, userId);
    await prisma.address.update({
      where: {
        id,
        userId,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}

const addressService = new AddressService();
export default addressService;
