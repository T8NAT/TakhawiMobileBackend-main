"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAvailableDriverMakeTrip = void 0;
const client_1 = __importDefault(require("../../prisma/client"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const userStatus_1 = require("../enum/userStatus");
const checkAvailableDriverMakeTrip = async (req, res, next) => {
    try {
        const { user: driverId } = req;
        const driver = await client_1.default.user.findUnique({
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
            throw new ApiError_1.default('Driver not found', 404);
        }
        //Check if driver verified in the future
        if (driver.driver_status !== userStatus_1.UserStatus.APPROVED) {
            throw new ApiError_1.default(`driverIsNotApprove, ${driver.driver_status}`, 400);
        }
        //Check if driver has reached the maximum number of cancellations in the future
        if (driver.driver_cancel_count >= 3) {
            throw new ApiError_1.default('Driver has reached the maximum number of cancellations, Contact with support team', 400);
        }
        //Check if driver has a vehicle
        const vehicle = driver.Vehicles[0];
        if (!vehicle) {
            throw new ApiError_1.default('Driver does not have a vehicle', 400);
        }
        req.body.vehicle_id = vehicle.id;
        //Check first if trip is basic trip or not to check seats_no
        if (req.body.seats_no) {
            const { seats_no } = req.body;
            if (vehicle.seats_no <= seats_no) {
                throw new ApiError_1.default('Driver vehicle does not have enough seats', 400);
            }
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.checkAvailableDriverMakeTrip = checkAvailableDriverMakeTrip;
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
