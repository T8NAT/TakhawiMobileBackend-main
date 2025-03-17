"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pug_1 = __importDefault(require("pug"));
const paymentGatewayService_1 = __importDefault(require("../services/paymentGatewayService"));
const response_1 = __importDefault(require("../utils/response"));
class PaymentGatewayController {
    async getApplePaySession(req, res, next) {
        try {
            const checkoutId = req.query.checkoutId;
            const type = req.query.type;
            const amount = await paymentGatewayService_1.default.getSessionAmount(checkoutId, type);
            const html = pug_1.default.renderFile('./src/templates/applePay.pug', {
                checkoutId,
                amount: Number(amount).toFixed(2),
                path: type === 'offer' ? `offer/apple-pay/accept/${checkoutId}` : `basic-trip/apple-pay/join/${checkoutId}`,
            });
            res.send(html);
        }
        catch (error) {
            next(error);
        }
    }
    async prepareCheckout(req, res, next) {
        try {
            const checkout = await paymentGatewayService_1.default.prepareCheckout();
            (0, response_1.default)(res, 200, {
                status: true,
                message: checkout.result.description,
                result: checkout,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getInitialPaymentStatus(req, res) {
        const domain = `${req.protocol}://${req.get('host')}`;
        try {
            const { checkOutId, userId } = req.params;
            await paymentGatewayService_1.default.getInitialPaymentStatus(checkOutId, +userId);
            res.redirect(`${domain}/api/payment-status/success`);
        }
        catch (error) {
            res.redirect(`${domain}/api/payment-status/fail?errorMessage=${error.message}`);
        }
    }
}
const paymentGatewayController = new PaymentGatewayController();
exports.default = paymentGatewayController;
