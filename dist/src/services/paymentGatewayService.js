"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const https_1 = __importDefault(require("https"));
const querystring_1 = __importDefault(require("querystring"));
const client_1 = __importDefault(require("../../prisma/client"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const wallet_1 = require("../enum/wallet");
class PaymentGatewayService {
    static handleResult(response, allowPending = false) {
        const { code } = response.result;
        const { description } = response.result;
        if (!code) {
            throw new ApiError_1.default('Invalid response: Missing result code', 500);
        }
        // Successful Transactions
        if (code.match(/^(000\.000\.|000\.100\.1|000\.[36]|000\.400\.[1][12]0)/)) {
            return response;
        }
        // Pending Transactions
        if (code.match(/^(000\.200)/)) {
            if (allowPending) {
                return response; // Accept the pending state as valid
            }
            throw new ApiError_1.default(`Transaction is pending: ${description}`, 400);
        }
        // Combined Validation Rejections
        if (code.match(/^(600\.[23]|500\.[12]|800\.121|100\.[13]50|100\.250|100\.360|700\.[1345][05]0|200\.[123]|100\.[53][07]|800\.900|100\.[69]00\.500|100\.800|100\.700|100\.900\.[123467890][00-99]|100\.100|100\.2[01]|100\.55|100\.380\.[23]|100\.380\.101)/)) {
            throw new ApiError_1.default(`Validation Error: ${description}`, 400);
        }
        // Rejected Transactions (3D secure, risk, or external bank rejections)
        if (code.match(/^(000\.400\.[1][0-9][1-9]|000\.400\.2)/)
            || code.match(/^(800\.[17]00|800\.800\.[123])/) || code.match(/^(100\.39[765])/)) {
            throw new ApiError_1.default(`Transaction rejected: ${description}`, 500);
        }
        // Unhandled cases
        throw new ApiError_1.default(`Unhandled result code: ${code}`, 500);
    }
    // Prepare Checkout
    async prepareCheckout(checkOutData) {
        const path = '/v1/checkouts';
        const data = querystring_1.default.stringify({
            entityId: process.env.ENTITY_ID_APPLEPAY,
            amount: checkOutData ? Number(checkOutData.amount).toFixed(2) : undefined,
            currency: 'SAR',
            paymentType: 'DB',
        });
        const options = PaymentGatewayService.reqOptions({
            path,
            method: 'POST',
            length: data.length,
        });
        const response = await PaymentGatewayService.requestHandler(options, data);
        return PaymentGatewayService.handleResult(response, true); // Allow pending
    }
    async prepareCheckoutCredit(userBillingInfo) {
        const path = '/v1/checkouts';
        const data = querystring_1.default.stringify({
            entityId: process.env.ENTITY_ID_CARD,
            createRegistration: 'true',
            'standingInstruction.mode': 'INITIAL',
            'standingInstruction.type': 'UNSCHEDULED',
            'standingInstruction.source': 'CIT',
            'standingInstruction.expiry': '2030-08-11',
            'customParameters[recurringPaymentAgreement]': userBillingInfo.recurringAgreementId,
            merchantTransactionId: new Date().getTime(),
            amount: 1.00,
            currency: 'SAR',
            paymentType: 'DB',
            'billing.country': 'SA',
            'customer.email': userBillingInfo.email,
            'billing.street1': userBillingInfo.street1,
            'billing.city': userBillingInfo.city,
            'billing.state': userBillingInfo.state,
            'billing.postcode': userBillingInfo.postcode,
            'customer.givenName': userBillingInfo.givenName,
            'customer.surname': userBillingInfo.surname,
        });
        const options = PaymentGatewayService.reqOptions({
            path,
            method: 'POST',
            length: data.length,
        });
        const response = await PaymentGatewayService.requestHandler(options, data);
        return PaymentGatewayService.handleResult(response, true); // Allow pending
    }
    // Get Registration Status
    async getInitialPaymentStatus(checkOutId, userId) {
        const path = `/v1/checkouts/${checkOutId}/payment?entityId=${process.env.ENTITY_ID_CARD}`;
        const options = PaymentGatewayService.reqOptions({ path, method: 'GET' });
        const response = await PaymentGatewayService.requestHandler(options);
        PaymentGatewayService.handleResult(response);
        // If success, store the card
        const card = await client_1.default.saved_Card.upsert({
            where: {
                Unique_Card: {
                    card_exp_month: response.card.expiryMonth,
                    card_exp_year: response.card.expiryYear,
                    card_number: response.card.last4Digits,
                    payment_brand: response.paymentBrand,
                    user_id: userId,
                },
            },
            create: {
                card_exp_month: response.card.expiryMonth,
                card_exp_year: response.card.expiryYear,
                card_number: response.card.last4Digits,
                user_id: userId,
                card_holder: response.card.holder,
                recurringAgreementId: response.customParameters.recurringPaymentAgreement,
                initialTransactionId: response.standingInstruction.initialTransactionId || '', // TODO: Remove this later (for testing) - ( '' )not needed in production
                payment_brand: response.paymentBrand,
                token: response.registrationId,
            },
            update: {
                recurringAgreementId: response.customParameters.recurringPaymentAgreement,
                initialTransactionId: response.standingInstruction.initialTransactionId || '', // TODO: Remove this later (for testing) - ( '' )not needed in production
                token: response.registrationId,
            },
        });
        // Create a transaction
        await client_1.default.credit_Card_Transaction.create({
            data: {
                amount: +response.amount,
                merchantTransactionId: response.merchantTransactionId,
                card_id: card.id,
                user_id: userId,
            },
        });
        const user = await client_1.default.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                user_wallet_balance: true,
            },
        });
        // Add 1 SAR to the wallet
        await client_1.default.user.update({
            where: {
                id: userId,
            },
            data: {
                user_wallet_balance: {
                    increment: 1.00,
                },
                Passenger_Wallet_Transaction: {
                    create: {
                        transaction_type: wallet_1.TransactionType.WALLET_RECHARGE,
                        amount: 1.00,
                        current_balance: user.user_wallet_balance + 1.00,
                        previous_balance: user.user_wallet_balance,
                    },
                },
            },
        });
    }
    async getPaymentStatus(checkoutId) {
        const path = `/v1/checkouts/${checkoutId}/payment?entityId=${process.env.APPLEPAY_ENTITY_ID}`;
        const options = PaymentGatewayService.reqOptions({ path, method: 'GET' });
        const response = await PaymentGatewayService.requestHandler(options);
        PaymentGatewayService.handleResult(response);
    }
    // Send Payment Data
    async sendPaymentData(paymentData) {
        const path = `/v1/registrations/${paymentData.token}/payments`;
        const data = querystring_1.default.stringify({
            entityId: process.env.RECURRING_ENTITY_ID,
            amount: paymentData.amount.toFixed(2),
            paymentType: 'DB',
            currency: 'SAR',
            'standingInstruction.mode': 'REPEATED',
            'standingInstruction.type': 'UNSCHEDULED',
            'standingInstruction.source': 'MIT',
            merchantTransactionId: paymentData.merchantTransactionId,
            'customParameters[recurringPaymentAgreement]': paymentData.recurringAgreementId,
            'standingInstruction.expiry': '2030-08-11',
        });
        const options = PaymentGatewayService.reqOptions({
            path,
            method: 'POST',
            length: data.length,
        });
        const response = await PaymentGatewayService.requestHandler(options, data);
        PaymentGatewayService.handleResult(response);
        await client_1.default.credit_Card_Transaction.create({
            data: {
                amount: paymentData.amount,
                merchantTransactionId: paymentData.merchantTransactionId,
                card_id: paymentData.cardId,
                user_id: paymentData.userId,
            },
        });
    }
    async deleteRegistration(token) {
        const path = `/v1/registrations/${token}?entityId=${process.env.ENTITY_ID_CARD}`;
        const options = PaymentGatewayService.reqOptions({
            path,
            method: 'DELETE',
        });
        const response = await PaymentGatewayService.requestHandler(options);
        PaymentGatewayService.handleResult(response);
    }
    async getSessionAmount(checkoutId, type) {
        if (type === 'offer') {
            const offer = await client_1.default.offers.findFirst({
                where: {
                    transactionId: checkoutId,
                },
                include: {
                    Trip: {
                        select: {
                            user_debt: true,
                            discount: true,
                        },
                    },
                },
            });
            if (!offer)
                throw new ApiError_1.default('Offer not found', 404);
            const totalPrice = offer.user_app_share
                + offer.price
                + offer.Trip.user_debt
                - offer.app_share_discount
                - offer.Trip.discount;
            return totalPrice;
        }
        const passenger = await client_1.default.passenger_Trip.findFirst({
            where: {
                transactionId: checkoutId,
            },
            include: {
                Basic_Trip: {
                    select: {
                        price_per_seat: true,
                    },
                },
            },
        });
        if (!passenger)
            throw new ApiError_1.default('Trip not found', 404);
        const totalprice = passenger.user_debt
            + passenger.user_app_share
            + passenger.Basic_Trip.price_per_seat
            - passenger.discount
            - passenger.app_share_discount;
        return totalprice;
    }
}
PaymentGatewayService.requestHandler = (options, data) => new Promise((resolve, reject) => {
    const req = https_1.default.request(options, (res) => {
        const buffers = [];
        res.on('data', (chunk) => buffers.push(chunk));
        res.on('end', () => {
            const response = Buffer.concat(buffers).toString('utf8');
            try {
                const jsonResponse = JSON.parse(response);
                resolve(jsonResponse);
            }
            catch (error) {
                reject(new ApiError_1.default(`Failed to parse response: ${response}`, 500));
            }
        });
    });
    req.on('error', (err) => {
        reject(new ApiError_1.default(`Request failed: ${err.message}`, 500));
    });
    if (data) {
        req.write(data);
    }
    req.end();
});
// Build request options
PaymentGatewayService.reqOptions = (config) => {
    const options = {
        port: 443,
        host: process.env.PAYMENT_GATEWAY_DOMAIN.replace('https://', ''),
        path: config.path,
        method: config.method,
        headers: {
            Authorization: `Bearer ${process.env.PAYMENT_ACCESS_TOKEN}`,
        },
    };
    if (config.method === 'POST' && config.length) {
        options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        options.headers['Content-Length'] = config.length;
    }
    return options;
};
const paymentGatewayService = new PaymentGatewayService();
exports.default = paymentGatewayService;
