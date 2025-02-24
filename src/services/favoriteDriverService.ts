import prisma from '../../prisma/client';
import { IFavoriteDriverService } from '../interfaces/favoriteDriverService';
import { QueryType } from '../types/queryType';
import ApiError from '../utils/ApiError';

class FavoriteDriverService implements IFavoriteDriverService {
  async addToFavorite(userId: number, driverId: number): Promise<void> {
    const favoriteDriver = await prisma.favorite_Driver.findUnique({
      where: {
        userId_driverId: {
          userId,
          driverId,
        },
      },
    });
    if (favoriteDriver) throw new ApiError('Driver already in favorites', 400);
    await prisma.favorite_Driver.create({
      data: {
        userId,
        driverId,
      },
    });
  }

  async removeFromFavorite(userId: number, driverId: number): Promise<void> {
    await prisma.favorite_Driver.deleteMany({
      where: {
        userId,
        driverId,
      },
    });
  }

  // Use raw query to get drivers reviews count
  async getFavoriteDrivers(userId: number, query: QueryType) {
    const page = query.page || 1;
    const limit = query.limit || 40;
    const offset = (page - 1) * limit;
    const data = await prisma.$queryRaw`
        SELECT d.id, d.name, d.avatar, d.driver_rate as rating, COUNT(r.id)::int AS reviews
        FROM "Favorite_Driver" fd
        JOIN "User" d ON fd."driverId" = d.id
        LEFT JOIN "Reviews" r ON d.id = r.target_id
        WHERE fd."userId" = ${userId}
        GROUP BY d.id, d.name, d.avatar, d.driver_rate
        LIMIT ${limit}
        OFFSET ${offset}
    `;
    const total = await prisma.favorite_Driver.count({
      where: {
        userId,
      },
    });
    const pagination = {
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      page: +page,
      limit: +limit,
    };
    return {
      data,
      pagination,
    };
  }
}

const favoriteDriverService = new FavoriteDriverService();
export default favoriteDriverService;
