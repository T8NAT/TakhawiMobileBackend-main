import prisma from '../../prisma/client';
import ApiError from '../utils/ApiError';
import { City, CityQueryType, CreateCity, UpdateCity } from '../types/cityType';
import { ICityService } from '../interfaces/cityService';
import { paginate } from '../utils/pagination';
import { PaginateType } from '../types/paginateType';

class CityService implements ICityService {
  async create(data: CreateCity): Promise<City> {
    return prisma.city.create({
      data,
    });
  }

  async getOne(id: number): Promise<City> {
    const city = await prisma.city.findUnique({
      where: {
        id,
      },
    });
    if (!city) throw new ApiError('City not found', 404);
    return city;
  }

  async getAll(queryString: CityQueryType): Promise<PaginateType<City>> {
    return paginate(
      'city',
      { where: { deletedAt: null } },
      queryString.page,
      queryString.limit,
    );
  }

  async update(id: number, data: UpdateCity): Promise<City> {
    await this.getOne(id);
    return prisma.city.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id: number): Promise<void> {
    await this.getOne(id);
    await prisma.city.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}

const cityService = new CityService();
export default cityService;
