import prisma from '../../prisma/client';
import { CreateRecentAddress, RecentAddress } from '../types/recentAddressType';
import { IRecentAddressService } from '../interfaces/recentAddressService';

class RecentAddressService implements IRecentAddressService {
  async create(data: CreateRecentAddress): Promise<RecentAddress> {
    const addresses = await this.getAll(data.userId);
    if (addresses.length >= 10) {
      await this.delete(addresses[addresses.length - 1].id);
    }
    return prisma.recent_Address.create({
      data,
    });
  }

  async getAll(userId: number): Promise<RecentAddress[]> {
    return prisma.recent_Address.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.recent_Address.delete({
      where: { id },
    });
  }
}

const recentAddressService = new RecentAddressService();
export default recentAddressService;
