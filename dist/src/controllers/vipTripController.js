"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vipTripService_1 = __importDefault(require("../services/vipTripService"));
const response_1 = __importDefault(require("../utils/response"));
const vehicle_serialization_1 = require("../utils/serialization/vehicle.serialization");
const event_listner_1 = require("../utils/event-listner");
const hobbies_serialization_1 = require("../utils/serialization/hobbies.serialization");
class VipTripController {
    async create(req, res, next) {
        try {
            const { user, gender } = req;
            const trip = await vipTripService_1.default.create({
                ...req.body,
                gender,
                passnger_id: user,
            });
            (0, response_1.default)(res, 201, {
                status: true,
                message: 'Trip created successfully',
                result: trip,
            });
            event_listner_1.customEventEmitter.emit('newVipTrip', trip);
        }
        catch (error) {
            next(error);
        }
    }
    async cancel(req, res, next) {
        try {
            const { user } = req;
            const data = await vipTripService_1.default.cancel(+req.params.trip_id, user, req.body);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Trip cancelled successfully',
            });
            if (data)
                event_listner_1.customEventEmitter.emit('userCancelation', data);
        }
        catch (error) {
            next(error);
        }
    }
    async driverCancelation(req, res, next) {
        try {
            const { user } = req;
            const data = await vipTripService_1.default.driverCancelation(+req.params.trip_id, user, req.body);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Trip cancelled by driver',
            });
            event_listner_1.customEventEmitter.emit('driverCancelation', data);
        }
        catch (error) {
            next(error);
        }
    }
    async getTripOffers(req, res, next) {
        try {
            const data = await vipTripService_1.default.getTripOffers(+req.params.trip_id, req.query);
            const { language, skipLang } = req;
            const serializedData = data.data.map((offer) => {
                if (offer.Driver
                    && offer.Driver.Vehicles
                    && offer.Driver.Vehicles.length > 0) {
                    offer.Driver.Vehicles = (0, vehicle_serialization_1.serializeVehicle)(offer.Driver.Vehicles[0], language);
                }
                return offer;
            });
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Offers retrieved successfully',
                pagination: data.pagination,
                result: skipLang ? data.data : serializedData,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async endTrip(req, res, next) {
        try {
            const { user } = req;
            const { tripStatusInfo, tripSummary } = await vipTripService_1.default.endTrip(user, +req.params.trip_id);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Trip ended',
                result: tripSummary,
            });
            event_listner_1.customEventEmitter.emit('tripStatusUpdate', tripStatusInfo);
            event_listner_1.customEventEmitter.emit('endTrip', tripSummary);
        }
        catch (error) {
            next(error);
        }
    }
    async getOne(req, res, next) {
        try {
            const { language } = req;
            const trip = await vipTripService_1.default.getOne(+req.params.id);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Vip Trip Featched Successfully',
                result: {
                    ...trip,
                    Passnger: {
                        ...trip.Passnger,
                        Hobbies: (0, hobbies_serialization_1.serializeHobbies)(trip.Passnger.Hobbies, language),
                    },
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
}
const vipTripController = new VipTripController();
exports.default = vipTripController;
