"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tripService_1 = __importDefault(require("../services/tripService"));
const response_1 = __importDefault(require("../utils/response"));
const trip_serialization_1 = require("../utils/serialization/trip.serialization");
const trips_serialization_1 = require("../utils/serialization/trips.serialization");
const activeTrip_serialization_1 = require("../utils/serialization/activeTrip.serialization");
const event_listner_1 = require("../utils/event-listner");
class TripController {
    async getCompletedTrips(req, res, next) {
        try {
            const { user, language, role } = req;
            const { data, pagination } = await tripService_1.default.getCompletedTrips(user, req.query, role);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Completed trips fetched successfully',
                pagination,
                result: (0, trip_serialization_1.serializeTripList)(data, language, role),
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getCancelledTrips(req, res, next) {
        try {
            const { user, language, role } = req;
            const { data, pagination } = await tripService_1.default.getCancelledTrips(user, req.query, role);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Cancelled trips fetched successfully',
                pagination,
                result: (0, trip_serialization_1.serializeTripList)(data, language, role),
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getUpcomingTrips(req, res, next) {
        try {
            const { user, language, role } = req;
            const { data, pagination } = await tripService_1.default.getUpcomingTrips(user, req.query, role);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Upcoming trips fetched successfully',
                pagination,
                result: (0, trip_serialization_1.serializeTripList)(data, language, role),
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getTrips(req, res, next) {
        try {
            const { language, skipLang } = req;
            const { data, pagination } = await tripService_1.default.getTrips(req.query);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Trips fetched successfully',
                pagination,
                result: skipLang ? data : (0, trips_serialization_1.serializeTrips)(data, language),
            });
        }
        catch (error) {
            next(error);
        }
    }
    async updateTripStatus(req, res, next) {
        try {
            const { status } = req.body;
            const { user } = req;
            const data = await tripService_1.default.updateTripStatus(+req.params.tripId, status, user);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Trip status updated successfully',
            });
            event_listner_1.customEventEmitter.emit('tripStatusUpdate', data);
        }
        catch (error) {
            next(error);
        }
    }
    async getNearByVipTrips(req, res, next) {
        try {
            const { gender } = req;
            const trips = await tripService_1.default.getNearByVipTrips({ ...req.query, gender });
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Trips featched successfully',
                result: trips,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getNearByVipTripsByDistance(req, res, next) {
        try {
            const { gender, lat, lng } = req;
            const trips = await tripService_1.default.getNearByVipTrips({
                lat, lng, gender, distance: +req.query.distance,
            });
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Trips featched successfully',
                result: trips,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getOne(req, res, next) {
        try {
            const { user, role, language } = req;
            const trip = await tripService_1.default.getOne(+req.params.tripId, user, role);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Trip featched successfully',
                result: (0, activeTrip_serialization_1.serializeActiveTrip)(trip, language, role),
            });
        }
        catch (error) {
            next(error);
        }
    }
}
const tripController = new TripController();
exports.default = tripController;
