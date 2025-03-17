"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAvailableReserve = void 0;
const client_1 = __importDefault(require("../../prisma/client"));
const trip_1 = require("../enum/trip");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const checkAvailableReserve = async (req, res, next) => {
    try {
        const { gender } = req;
        const { user: passengerId } = req;
        const { trip_id } = req.body;
        const passenger = await client_1.default.user.findUnique({
            where: { id: passengerId },
        });
        if (!passenger) {
            throw new ApiError_1.default('Passenger not found', 404);
        }
        const trip = await client_1.default.trip.findUnique({
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
            throw new ApiError_1.default('Trip not found', 404);
        }
        const tripStatusesAllowed = [
            trip_1.TripStatus.PENDING,
            trip_1.TripStatus.UPCOMING,
        ];
        if (!tripStatusesAllowed.includes(trip.status)) {
            throw new ApiError_1.default(`UnableJoin${trip.status}`, 400);
        }
        if (trip.gender !== gender) {
            throw new ApiError_1.default('This trip is not available for your gender', 400);
        }
        const passengerTrip = trip.Basic_Trip?.Passengers[0];
        if (passengerTrip &&
            passengerTrip.status !== trip_1.PassengerTripStatus.CANCELLED_BY_PASSENGER) {
            throw new ApiError_1.default('You have already joined this trip', 400);
        }
        if (trip.Basic_Trip.available_seats_no <= 0) {
            throw new ApiError_1.default('This trip is full', 400);
        }
        if (passenger.passenger_cancel_count >= 3) {
            throw new ApiError_1.default('You are not allowed to join this trip, you have reached the maximum number of cancellations', 400);
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.checkAvailableReserve = checkAvailableReserve;
