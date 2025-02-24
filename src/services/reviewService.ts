import { Prisma } from '@prisma/client';
import prisma from '../../prisma/client';
import { Roles } from '../enum/roles';
import { IReviewService } from '../interfaces/reviewService';
import { PaginateType } from '../types/paginateType';
import { CreateReview, ReviewQueryType, Review } from '../types/reviewType';
import ApiError from '../utils/ApiError';
import { paginate } from '../utils/pagination';
import { PassengerTripStatus, TripStatus } from '../enum/trip';

export class ReviewService implements IReviewService {
  async createDriverReview(data: CreateReview): Promise<Review> {
    await this.reviewExists(data);
    const compltedTrip = await prisma.trip.findUnique({
      where: {
        id: data.trip_id,
        driver_id: data.target_id,
        status: TripStatus.COMPLETED,
        OR: [
          {
            Basic_Trip: {
              Passengers: {
                some: {
                  passenger_id: data.reviewer_id,
                  status: PassengerTripStatus.COMPLETED,
                },
              },
            },
          },
          {
            VIP_Trip: {
              passnger_id: data.reviewer_id,
            },
          },
        ],
      },
    });
    if (!compltedTrip) {
      throw new ApiError('Trip not found', 404);
    }

    return prisma.$transaction(async (prisma) => {
      const review = await prisma.reviews.create({
        data: {
          ...data,
          type: Roles.USER,
        },
      });
      await this.calculateAverageRating(prisma, data.target_id, Roles.DRIVER);
      return review;
    });
  }

  async createPassengerReview(data: CreateReview): Promise<Review> {
    await this.reviewExists(data);
    const compltedTrip = await prisma.trip.findUnique({
      where: {
        id: data.trip_id,
        driver_id: data.reviewer_id,
        status: TripStatus.COMPLETED,
        OR: [
          {
            Basic_Trip: {
              Passengers: {
                some: {
                  passenger_id: data.target_id,
                  status: PassengerTripStatus.COMPLETED,
                },
              },
            },
          },
          {
            VIP_Trip: {
              passnger_id: data.target_id,
            },
          },
        ],
      },
    });
    if (!compltedTrip) {
      throw new ApiError('Trip not found', 404);
    }

    return prisma.$transaction(async (prisma) => {
      const review = await prisma.reviews.create({
        data: {
          ...data,
          type: Roles.DRIVER,
        },
      });
      await this.calculateAverageRating(prisma, data.target_id, Roles.USER);
      return review;
    });
  }

  async getOne(id: number): Promise<Review> {
    const review = await prisma.reviews.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    });
    if (!review) {
      throw new ApiError('Review not found', 404);
    }
    return review;
  }

  async getAll(
    queryString: ReviewQueryType,
    role: string,
    userId?: number,
  ): Promise<PaginateType<Review>> {
    const filterOptions = {
      where:
        role === Roles.ADMIN || role === Roles.SUPER_ADMIN
          ? {
              target_id: queryString.target_id
                ? +queryString.target_id
                : undefined,
              type: queryString.type ? queryString.type : undefined,
              trip_id: queryString.trip_id ? +queryString.trip_id : undefined,
            }
          : {
              target_id: userId,
            },
      include: {
        Reviewers: {
          select: {
            name: true,
            avatar: true,
          },
        },
      },
    };
    return paginate(
      'reviews',
      filterOptions,
      queryString.page,
      queryString.limit,
    );
  }

  private async reviewExists(data: CreateReview): Promise<void> {
    const reviewExist = await prisma.reviews.findFirst({
      where: {
        trip_id: data.trip_id,
        reviewer_id: data.reviewer_id,
        target_id: data.target_id,
      },
    });
    if (reviewExist) {
      throw new ApiError('Review already exists.', 400);
    }
  }

  private async calculateAverageRating(
    prisma: Prisma.TransactionClient,
    userId: number,
    role: string,
  ): Promise<void> {
    const { _avg } = await prisma.reviews.aggregate({
      where: {
        target_id: userId,
        type: role === Roles.DRIVER ? Roles.USER : Roles.DRIVER,
        deletedAt: null,
      },
      _avg: {
        rate: true,
      },
    });

    const averageRating = _avg.rate ?? 5;

    await prisma.user.update({
      where: { id: userId },
      data: {
        [role === Roles.DRIVER ? 'driver_rate' : 'passenger_rate']:
          averageRating,
      },
    });
  }
}

const reviewService = new ReviewService();
export default reviewService;
