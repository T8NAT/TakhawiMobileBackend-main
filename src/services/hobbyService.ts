import prisma from '../../prisma/client';
import { IHobbyService } from '../interfaces/hobbyService';
import {
  CreateHobby,
  UpdateHobby,
  Hobby,
  HobbyQueryType,
} from '../types/hobbyType';
import { PaginateType } from '../types/paginateType';
import ApiError from '../utils/ApiError';
import { paginate } from '../utils/pagination';

class HobbyService implements IHobbyService {
  async create(data: CreateHobby): Promise<Hobby> {
    return prisma.hobbies.create({ data });
  }

  async getOne(id: number): Promise<Hobby> {
    const hobby = await prisma.hobbies.findUnique({ where: { id } });
    if (!hobby) {
      throw new ApiError('Hobby not found', 404);
    }
    return hobby;
  }

  async getAll(queryString: HobbyQueryType): Promise<PaginateType<Hobby>> {
    return paginate('hobbies', {}, queryString.page, queryString.limit);
  }

  async update(id: number, data: UpdateHobby): Promise<Hobby> {
    await this.getOne(id);
    return prisma.hobbies.update({ where: { id }, data });
  }

  async delete(id: number): Promise<void> {
    await this.getOne(id);
    await prisma.hobbies.delete({
      where: {
        id,
      },
    });
  }

  // async delete(id: number): Promise<void> {
  // await prisma.$executeRaw`
  // DELETE FROM "Hobbies" WHERE id = ${id};
  // DELETE FROM "_UserToHobbies" WHERE "B" = ${id};
  // `;
  //     await this.getOne(id)
  //     await prisma.hobbies.delete({
  //         where: {
  //             id
  //         }
  //     })

  //     const usersWithHobby = await prisma.user.findMany({
  //         where: {
  //             Hobbies: {
  //                 some: {
  //                     id
  //                 }
  //             }
  //         }
  //     });

  //     const userUpdates = usersWithHobby.map(user => prisma.user.update({
  //         where: { id: user.id },
  //         data: {
  //             Hobbies: {
  //                 disconnect: {
  //                     id
  //                 }
  //             }
  //         }
  //     }));

  //     await prisma.$transaction(userUpdates);
  // }
}

const hobbyService = new HobbyService();
export default hobbyService;
