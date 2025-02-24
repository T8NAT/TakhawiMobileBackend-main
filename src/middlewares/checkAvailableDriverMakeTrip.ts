import { Request, Response, NextFunction } from 'express';
import prisma from '../../prisma/client';
import ApiError from '../utils/ApiError';
import CustomRequest from '../interfaces/customRequest';
import { TripStatus } from '../enum/trip';
import { UserStatus } from '../enum/userStatus';

export const checkAvailableDriverMakeTrip = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { user: driverId } = req as CustomRequest;
    const driver = await prisma.user.findUnique({
      where: {
        id: driverId,
      },
      select: {
        driver_status: true,
        driver_cancel_count: true,
        Vehicles: {
          where: {
            deletedAt: null,
          },
          select: {
            id: true,
            seats_no: true,
          },
          take: 1,
        },
      },
    });
    if (!driver) {
      throw new ApiError('Driver not found', 404);
    }
    //Check if driver verified in the future
    if (driver.driver_status !== UserStatus.APPROVED) {
      throw new ApiError(`driverIsNotApprove, ${driver.driver_status}`, 400);
    }
    //Check if driver has reached the maximum number of cancellations in the future
    if (driver.driver_cancel_count >= 3) {
      throw new ApiError(
        'Driver has reached the maximum number of cancellations, Contact with support team',
        400,
      );
    }
    //Check if driver has a vehicle
    const vehicle = driver.Vehicles[0];
    if (!vehicle) {
      throw new ApiError('Driver does not have a vehicle', 400);
    }
    req.body.vehicle_id = vehicle.id;
    //Check first if trip is basic trip or not to check seats_no
    if (req.body.seats_no) {
      const { seats_no } = req.body;
      if (vehicle.seats_no <= seats_no) {
        throw new ApiError('Driver vehicle does not have enough seats', 400);
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};

// Check if driver has a trip not finished (Dont make trips at the same time)
/*         const { start_date, end_date } = req.body;
                const overlappingTrip = await prisma.trip.findFirst({
                    where: {
                        driver_id: driverId,
                        status: {
                            notIn: [TripStatus.COMPLETED, TripStatus.CANCELLED]
                        },
                        OR: [
                            {
                                start_date: {
                                    lte: new Date(end_date),
                                },
                                end_date: {
                                    gte: new Date(start_date),
                                },
                            },
                            {
                                start_date: {
                                    lte: new Date(start_date),
                                },
                                end_date: {
                                    gte: new Date(start_date),
                                },
                            },
                            {
                                start_date: {
                                    lte: new Date(end_date),
                                },
                                end_date: {
                                    gte: new Date(end_date),
                                },
                            }
                        ]
                    }
                });
  
                if (overlappingTrip) {
                    throw new ApiError('Driver has an overlapping trip and cannot create a new one', 400);
                } */
