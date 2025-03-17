"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processPaymentMiddleware = void 0;
const tripService_1 = __importDefault(require("../services/tripService"));
const trip_1 = require("../enum/trip");
const PaymentFactory_1 = require("../strategies/PaymentFactory");
const processPaymentMiddleware = async (req, res, next) => {
    try {
        const { user: userId } = req;
        const { offer_id } = req.params;
        const { payment_method, trip_id, card_id, coupon, } = req.body;
        const tripOrOfferId = +(trip_id || offer_id);
        // Calculate trip price
        const data = {
            id: tripOrOfferId,
            coupon,
            passenger_id: userId,
            type: trip_id ? trip_1.TripType.BASICTRIP : trip_1.TripType.VIPTRIP,
        };
        const tripPriceBreakdown = await tripService_1.default.calculateTripPrice(data);
        console.log('tripPriceBreakdown', tripPriceBreakdown);
        // Select payment strategy based on paymentMethod
        const paymentContext = PaymentFactory_1.PaymentFactory.createPaymentContext(payment_method);
        const paymentData = {
            amount: tripPriceBreakdown.total_price,
            userId,
            tripOrOfferId,
            cardId: card_id,
            type: trip_id ? trip_1.TripType.BASICTRIP : trip_1.TripType.VIPTRIP,
        };
        // Process payment using the selected strategy
        const paymentResponse = await paymentContext.processPayment(paymentData);
        req.body.tripPriceBreakdown = tripPriceBreakdown;
        req.body.paymentHtml = paymentResponse && paymentResponse.html ? paymentResponse.html : undefined;
        req.body.transactionId = paymentResponse && paymentResponse.transactionId ? paymentResponse.transactionId : undefined;
        req.body.path = paymentResponse && paymentResponse.path ? paymentResponse.path : undefined;
        req.body.checkOutId = paymentResponse && paymentResponse.checkOutId ? paymentResponse.checkOutId : undefined;
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.processPaymentMiddleware = processPaymentMiddleware;
