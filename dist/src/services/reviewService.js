"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewService = void 0;
const client_1 = __importDefault(require("../../prisma/client"));
const roles_1 = require("../enum/roles");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const pagination_1 = require("../utils/pagination");
const trip_1 = require("../enum/trip");
class ReviewService {
    async createDriverReview(data) {
        await this.reviewExists(data);
        const compltedTrip = await client_1.default.trip.findUnique({
            where: {
                id: data.trip_id,
                driver_id: data.target_id,
                status: trip_1.TripStatus.COMPLETED,
                OR: [
                    {
                        Basic_Trip: {
                            Passengers: {
                                some: {
                                    passenger_id: data.reviewer_id,
                                    status: trip_1.PassengerTripStatus.COMPLETED,
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
            throw new ApiError_1.default('Trip not found', 404);
        }
        return client_1.default.$transaction(async (prisma) => {
            const review = await prisma.reviews.create({
                data: {
                    ...data,
                    type: roles_1.Roles.USER,
                },
            });
            await this.calculateAverageRating(prisma, data.target_id, roles_1.Roles.DRIVER);
            return review;
        });
    }
    async createPassengerReview(data) {
        await this.reviewExists(data);
        const compltedTrip = await client_1.default.trip.findUnique({
            where: {
                id: data.trip_id,
                driver_id: data.reviewer_id,
                status: trip_1.TripStatus.COMPLETED,
                OR: [
                    {
                        Basic_Trip: {
                            Passengers: {
                                some: {
                                    passenger_id: data.target_id,
                                    status: trip_1.PassengerTripStatus.COMPLETED,
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
            throw new ApiError_1.default('Trip not found', 404);
        }
        return client_1.default.$transaction(async (prisma) => {
            const review = await prisma.reviews.create({
                data: {
                    ...data,
                    type: roles_1.Roles.DRIVER,
                },
            });
            await this.calculateAverageRating(prisma, data.target_id, roles_1.Roles.USER);
            return review;
        });
    }
    async getOne(id) {
        const review = await client_1.default.reviews.findUnique({
            where: {
                id,
                deletedAt: null,
            },
        });
        if (!review) {
            throw new ApiError_1.default('Review not found', 404);
        }
        return review;
    }
    async getAll(queryString, role, userId) {
        const filterOptions = {
            where: role === roles_1.Roles.ADMIN || role === roles_1.Roles.SUPER_ADMIN
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
        return (0, pagination_1.paginate)('reviews', filterOptions, queryString.page, queryString.limit);
    }
    async reviewExists(data) {
        const reviewExist = await client_1.default.reviews.findFirst({
            where: {
                trip_id: data.trip_id,
                reviewer_id: data.reviewer_id,
                target_id: data.target_id,
            },
        });
        if (reviewExist) {
            throw new ApiError_1.default('Review already exists.', 400);
        }
    }
    async calculateAverageRating(prisma, userId, role) {
        const { _avg } = await prisma.reviews.aggregate({
            where: {
                target_id: userId,
                type: role === roles_1.Roles.DRIVER ? roles_1.Roles.USER : roles_1.Roles.DRIVER,
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
                [role === roles_1.Roles.DRIVER ? 'driver_rate' : 'passenger_rate']: averageRating,
            },
        });
    }
}
exports.ReviewService = ReviewService;
const reviewService = new ReviewService();
exports.default = reviewService;
