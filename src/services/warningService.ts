import moment from 'moment';
import prisma from '../../prisma/client';
import { IWarningSarvice } from '../interfaces/warningService';
import {
  CreateWarningType,
  Warning,
  WarningQueryType,
} from '../types/warningType';
import ApiError from '../utils/ApiError';

class WarningService implements IWarningSarvice {
  async getOne(id: number): Promise<Warning> {
    const warning = await prisma.warning.findUnique({
      where: {
        id,
      },
    });
    if (!warning) throw new ApiError('No warning found', 404);
    return warning;
  }

  create(data: CreateWarningType): Promise<Warning> {
    const warning = prisma.warning.create({
      data: {
        ...data,
        expiration_date: moment().add(1, 'days').toDate(),
      },
    });
    return warning;
  }

  async delete(id: number): Promise<void> {
    await this.getOne(id);
    await prisma.warning.delete({
      where: {
        id,
      },
    });
  }

  getAll(location: WarningQueryType): Promise<Warning[]> {
    return prisma.$queryRaw`
      SELECT *
      FROM (
        SELECT id, ar_type, en_type, location,
          2 * 6371 * asin(
            sqrt(
              (sin(radians((CAST(location->>'lat' AS FLOAT) - ${+location.lat!}) / 2))) ^ 2
              + cos(radians(${+location.lat!})) * cos(radians(CAST(location->>'lat' AS FLOAT)))
              * (sin(radians((CAST(location->>'lng' AS FLOAT) - ${+location.lng!}) / 2))) ^ 2
            )
          ) as distance
        FROM "Warning"
      ) AS subquery
      WHERE distance < 10
      ORDER BY distance
    `;
  }

  async deleteExpiredWarnings(): Promise<void> {
    await prisma.warning.deleteMany({
      where: {
        expiration_date: {
          lte: new Date(),
        },
      },
    });
  }
}

const warningService = new WarningService();
export default warningService;
