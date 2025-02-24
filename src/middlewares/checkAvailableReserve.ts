import { Request, Response, NextFunction } from 'express';
import prisma from '../../prisma/client';
import { PassengerTripStatus, TripStatus } from '../enum/trip';
import ApiError from '../utils/ApiError';
import CustomRequest from '../interfaces/customRequest';

export const checkAvailableReserve = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { gender } = req as CustomRequest;
    const { user: passengerId } = req as CustomRequest;
    const { trip_id } = req.body;
    const passenger = await prisma.user.findUnique({
      where: { id: passengerId },
    });
    if (!passenger) {
      throw new ApiError('Passenger not found', 404);
    }
    const trip = await prisma.trip.findUnique({
      where: { id: trip_id },
      select: {
        status: true,
        gender: true,
        Basic_Trip: {
          select: {
            available_seats_no: true,
            Passengers: {
              where: { passenger_id: passengerId },
              orderBy: { createdAt: 'desc' },
            },
          },
        },
      },
    });

    if (!trip || !trip.Basic_Trip) {
      throw new ApiError('Trip not found', 404);
    }

    const tripStatusesAllowed: TripStatus[] = [
      TripStatus.PENDING,
      TripStatus.UPCOMING,
    ];

    if (!tripStatusesAllowed.includes(trip.status as TripStatus)) {
      throw new ApiError(`UnableJoin${trip.status}`, 400);
    }

    if (trip.gender !== gender) {
      throw new ApiError('This trip is not available for your gender', 400);
    }

    const passengerTrip = trip.Basic_Trip?.Passengers[0];

    if (
      passengerTrip &&
      passengerTrip.status !== PassengerTripStatus.CANCELLED_BY_PASSENGER
    ) {
      throw new ApiError('You have already joined this trip', 400);
    }

    if (trip.Basic_Trip!.available_seats_no <= 0) {
      throw new ApiError('This trip is full', 400);
    }

    if (passenger.passenger_cancel_count >= 3) {
      throw new ApiError(
        'You are not allowed to join this trip, you have reached the maximum number of cancellations',
        400,
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};
