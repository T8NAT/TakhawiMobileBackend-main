"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pug_1 = __importDefault(require("pug"));
const response_1 = __importDefault(require("../utils/response"));
const basicTripService_1 = __importDefault(require("../services/basicTripService"));
const basicTrip_serialization_1 = require("../utils/serialization/basicTrip.serialization");
const event_listner_1 = require("../utils/event-listner");
const payment_1 = require("../enum/payment");
class BasicTripController {
    async applepayJoin(req, res) {
        try {
            const { transactionId } = req.params;
            await basicTripService_1.default.applepayJoin(transactionId);
            const html = pug_1.default.renderFile('./src/templates/paymentResponse.pug', {
                status: true,
            });
            res.send(html);
        }
        catch (error) {
            const html = pug_1.default.renderFile('./src/templates/paymentResponse.pug', {
                status: false,
                errorMessage: error.message,
            });
            res.send(html);
        }
    }
    async create(req, res, next) {
        try {
            const { user, gender } = req;
            const trip = await basicTripService_1.default.create(req.body, user, gender);
            (0, response_1.default)(res, 201, {
                status: true,
                message: 'Basic Trip Created Successfully',
                result: trip,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async get(req, res, next) {
        try {
            const { user, language } = req;
            const { tripId } = req.params;
            const trip = await basicTripService_1.default.get(+tripId, user);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Basic Trip Details Fetched Successfully',
                result: (0, basicTrip_serialization_1.basicTripSerialization)(trip, language),
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getAll(req, res, next) {
        try {
            const { gender, user, language } = req;
            const trips = await basicTripService_1.default.getAll(user, language, gender, req.query);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Basic Trips Fetched Successfully',
                result: trips,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async join(req, res, next) {
        try {
            const { user } = req;
            const trip = await basicTripService_1.default.join({ ...req.body, passenger_id: user }, req.body.tripPriceBreakdown);
            if (req.body.payment_method === payment_1.PaymentMethod.APPLEPAY) {
                return (0, response_1.default)(res, 200, {
                    status: true,
                    message: 'Bassic trip seat on hold',
                    result: {
                        checkOutId: req.body.checkOutId,
                    },
                });
            }
            (0, response_1.default)(res, 201, {
                status: true,
                message: 'Joined Basic Trip Successfully',
                result: trip,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async cancelBYDriver(req, res, next) {
        try {
            const { user } = req;
            const { tripId } = req.params;
            const data = await basicTripService_1.default.cancelByDriver({
                trip_id: +tripId,
                user_id: user,
                ...req.body,
            });
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Basic Trip Cancelled Successfully',
            });
            if (data)
                event_listner_1.customEventEmitter.emit('driverCancelation', data);
        }
        catch (error) {
            next(error);
        }
    }
    async cancelByPassenger(req, res, next) {
        try {
            const { user } = req;
            const { passengerTripId } = req.params;
            const data = await basicTripService_1.default.cancelByPassenger({
                passenger_trip_id: +passengerTripId,
                user_id: user,
                ...req.body,
            });
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Basic Trip Cancelled Successfully',
            });
            if (data)
                event_listner_1.customEventEmitter.emit('userCancelation', data);
        }
        catch (error) {
            next(error);
        }
    }
    async endTrip(req, res, next) {
        try {
            const { user } = req;
            const { tripId } = req.params;
            const { tripStatusInfo, tripSummary } = await basicTripService_1.default.endTrip(+tripId, user);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Basic Trip Ended Successfully',
                result: tripSummary,
            });
            event_listner_1.customEventEmitter.emit('tripStatusUpdate', tripStatusInfo);
            event_listner_1.customEventEmitter.emit('endTrip', tripSummary);
        }
        catch (error) {
            next(error);
        }
    }
    async calculateTripPrice(req, res, next) {
        try {
            const { user } = req;
            const { tripId } = req.params;
            const price = await basicTripService_1.default.calculateTripPrice({
                ...req.body,
                trip_id: +tripId,
                passenger_id: user,
            });
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Trip Price Calculated Successfully',
                result: price,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async markPassengerAsArrived(req, res, next) {
        try {
            await basicTripService_1.default.markPassengerAsArrived(+req.params.passengerTripId);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Passenger Marked as Arrived Successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
}
const basicTripController = new BasicTripController();
exports.default = basicTripController;
