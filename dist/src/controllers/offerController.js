"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pug_1 = __importDefault(require("pug"));
const offerService_1 = __importDefault(require("../services/offerService"));
const event_listner_1 = require("../utils/event-listner");
const response_1 = __importDefault(require("../utils/response"));
const payment_1 = require("../enum/payment");
class OfferController {
    async makeOffer(req, res, next) {
        try {
            const { user, gender } = req;
            const { Trip, ...offer } = await offerService_1.default.makeOffer(+req.params.trip_id, gender, {
                ...req.body,
                driver_id: user,
            });
            event_listner_1.customEventEmitter.emit('newOffer', {
                roomId: Trip.Passnger.uuid,
                language: Trip.Passnger.prefered_language,
                offer,
                fcm_tokens: Trip.Passnger.User_FCM_Tokens,
            });
            (0, response_1.default)(res, 201, {
                status: true,
                message: 'Offer created successfully',
                result: offer,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async acceptOffer(req, res, next) {
        try {
            const { user } = req;
            const offer = await offerService_1.default.acceptOffer(+req.params.offer_id, user, req.body);
            if (req.body.payment_method === payment_1.PaymentMethod.APPLEPAY) {
                return (0, response_1.default)(res, 200, {
                    status: true,
                    message: 'Offer on hold',
                    result: {
                        checkOutId: req.body.checkOutId,
                    },
                });
            }
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Offer accepted successfully',
            });
            event_listner_1.customEventEmitter.emit('offerAccepted', offer);
        }
        catch (error) {
            next(error);
        }
    }
    async rejectOffer(req, res, next) {
        try {
            const { user } = req;
            await offerService_1.default.rejectOffer(+req.params.offer_id, user);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Offer rejected successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
    async applepayAcceptOffer(req, res) {
        try {
            const { transactionId } = req.params;
            const result = await offerService_1.default.applepayAcceptOffer(transactionId);
            const html = pug_1.default.renderFile('./src/templates/paymentResponse.pug', {
                status: true,
            });
            res.send(html);
            event_listner_1.customEventEmitter.emit('offerAccepted', result);
        }
        catch (error) {
            const html = pug_1.default.renderFile('./src/templates/paymentResponse.pug', {
                status: false,
                errorMessage: error.message,
            });
            res.send(html);
        }
    }
    async calculateOfferPrice(req, res, next) {
        try {
            const { user } = req;
            const result = await offerService_1.default.calculateOfferPrice({
                ...req.body,
                offerId: +req.params.offerId,
                userId: user,
            });
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Price calculated successfully',
                result,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
const offerController = new OfferController();
exports.default = offerController;
