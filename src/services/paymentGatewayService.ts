import https from 'https';
import querystring from 'querystring';
import prisma from '../../prisma/client';
import {
  PaymentDataType,
  ReqOptions,
  ReqOptionsType,
  ResponseRegistrationType,
  ResponseInitialPaymentType,
  ResponseCheckoutType,
  ResponseType,
  UserBillingType,
} from '../types/paymentGatewayType';
import ApiError from '../utils/ApiError';
import { TransactionType } from '../enum/wallet';

class PaymentGatewayService {
  static requestHandler = <T extends ResponseType>(
    options: ReqOptions,
    data?: string,
  ): Promise<T> =>
    new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        const buffers: Buffer[] = [];
        res.on('data', (chunk) => buffers.push(chunk));
        res.on('end', () => {
          const response = Buffer.concat(buffers).toString('utf8');
          try {
            const jsonResponse: T = JSON.parse(response);
            resolve(jsonResponse);
          } catch (error) {
            reject(new ApiError(`Failed to parse response: ${response}`, 500));
          }
        });
      });
      req.on('error', (err) => {
        reject(new ApiError(`Request failed: ${err.message}`, 500));
      });

      if (data) {
        req.write(data);
      }

      req.end();
    });

  // Build request options
  static reqOptions = (config: ReqOptionsType): ReqOptions => {
    const options: ReqOptions = {
      port: 443,
      host: process.env.PAYMENT_GATEWAY_DOMAIN!.replace('https://', ''),
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

  static handleResult<T>(response: T, allowPending = false): T {
    const { code } = (response as ResponseType).result;
    const { description } = (response as ResponseType).result;

    if (!code) {
      throw new ApiError('Invalid response: Missing result code', 500);
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
      throw new ApiError(`Transaction is pending: ${description}`, 400);
    }

    // Combined Validation Rejections
    if (
      code.match(
        /^(600\.[23]|500\.[12]|800\.121|100\.[13]50|100\.250|100\.360|700\.[1345][05]0|200\.[123]|100\.[53][07]|800\.900|100\.[69]00\.500|100\.800|100\.700|100\.900\.[123467890][00-99]|100\.100|100\.2[01]|100\.55|100\.380\.[23]|100\.380\.101)/,
      )
    ) {
      throw new ApiError(`Validation Error: ${description}`, 400);
    }

    // Rejected Transactions (3D secure, risk, or external bank rejections)
    if (
      code.match(/^(000\.400\.[1][0-9][1-9]|000\.400\.2)/) ||
      code.match(/^(800\.[17]00|800\.800\.[123])/) ||
      code.match(/^(100\.39[765])/)
    ) {
      throw new ApiError(`Transaction rejected: ${description}`, 500);
    }

    // Unhandled cases
    throw new ApiError(`Unhandled result code: ${code}`, 500);
  }

  // Prepare Checkout
  async prepareCheckout(checkOutData?: any): Promise<ResponseCheckoutType> {
    const path = '/v1/checkouts';
    const data = querystring.stringify({
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

    const response =
      await PaymentGatewayService.requestHandler<ResponseCheckoutType>(
        options,
        data,
      );

    return PaymentGatewayService.handleResult(response, true); // Allow pending
  }

  async prepareCheckoutCredit(
    userBillingInfo: UserBillingType,
  ): Promise<ResponseCheckoutType> {
    const path = '/v1/checkouts';
    const data = querystring.stringify({
      entityId: process.env.ENTITY_ID_CARD,
      createRegistration: 'true',
      'standingInstruction.mode': 'INITIAL',
      'standingInstruction.type': 'UNSCHEDULED',
      'standingInstruction.source': 'CIT',
      'standingInstruction.expiry': '2030-08-11',
      'customParameters[recurringPaymentAgreement]':
        userBillingInfo.recurringAgreementId,
      merchantTransactionId: new Date().getTime(),
      amount: 1.0,
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

    const response =
      await PaymentGatewayService.requestHandler<ResponseCheckoutType>(
        options,
        data,
      );

    return PaymentGatewayService.handleResult(response, true); // Allow pending
  }

  // Get Registration Status
  async getInitialPaymentStatus(
    checkOutId: string,
    userId: number,
  ): Promise<void> {
    const path = `/v1/checkouts/${checkOutId}/payment?entityId=${process.env.ENTITY_ID_CARD}`;
    const options = PaymentGatewayService.reqOptions({ path, method: 'GET' });
    const response =
      await PaymentGatewayService.requestHandler<ResponseInitialPaymentType>(
        options,
      );

    PaymentGatewayService.handleResult(response);

    // If success, store the card
    const card = await prisma.saved_Card.upsert({
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
        recurringAgreementId:
          response.customParameters.recurringPaymentAgreement,
        initialTransactionId:
          response.standingInstruction.initialTransactionId || '', // TODO: Remove this later (for testing) - ( '' )not needed in production
        payment_brand: response.paymentBrand,
        token: response.registrationId,
      },
      update: {
        recurringAgreementId:
          response.customParameters.recurringPaymentAgreement,
        initialTransactionId:
          response.standingInstruction.initialTransactionId || '', // TODO: Remove this later (for testing) - ( '' )not needed in production
        token: response.registrationId,
      },
    });
    // Create a transaction
    await prisma.credit_Card_Transaction.create({
      data: {
        amount: +response.amount,
        merchantTransactionId: response.merchantTransactionId,
        card_id: card.id,
        user_id: userId,
      },
    });
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        user_wallet_balance: true,
      },
    });
    // Add 1 SAR to the wallet
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        user_wallet_balance: {
          increment: 1.0,
        },
        Passenger_Wallet_Transaction: {
          create: {
            transaction_type: TransactionType.WALLET_RECHARGE,
            amount: 1.0,
            current_balance: user!.user_wallet_balance + 1.0,
            previous_balance: user!.user_wallet_balance,
          },
        },
      },
    });
  }

  async getPaymentStatus(checkoutId: string): Promise<void> {
    const path = `/v1/checkouts/${checkoutId}/payment?entityId=${process.env.APPLEPAY_ENTITY_ID}`;
    const options = PaymentGatewayService.reqOptions({ path, method: 'GET' });

    const response =
      await PaymentGatewayService.requestHandler<ResponseRegistrationType>(
        options,
      );

    PaymentGatewayService.handleResult(response);
  }

  // Send Payment Data
  async sendPaymentData(paymentData: PaymentDataType): Promise<void> {
    const path = `/v1/registrations/${paymentData.token}/payments`;
    const data = querystring.stringify({
      entityId: process.env.RECURRING_ENTITY_ID,
      amount: paymentData.amount.toFixed(2),
      paymentType: 'DB',
      currency: 'SAR',
      'standingInstruction.mode': 'REPEATED',
      'standingInstruction.type': 'UNSCHEDULED',
      'standingInstruction.source': 'MIT',
      merchantTransactionId: paymentData.merchantTransactionId,
      'customParameters[recurringPaymentAgreement]':
        paymentData.recurringAgreementId,
      'standingInstruction.expiry': '2030-08-11',
    });

    const options = PaymentGatewayService.reqOptions({
      path,
      method: 'POST',
      length: data.length,
    });

    const response = await PaymentGatewayService.requestHandler(options, data);

    PaymentGatewayService.handleResult(response);

    await prisma.credit_Card_Transaction.create({
      data: {
        amount: paymentData.amount,
        merchantTransactionId: paymentData.merchantTransactionId,
        card_id: paymentData.cardId,
        user_id: paymentData.userId,
      },
    });
  }

  async deleteRegistration(token: string): Promise<void> {
    const path = `/v1/registrations/${token}?entityId=${process.env.ENTITY_ID_CARD}`;
    const options = PaymentGatewayService.reqOptions({
      path,
      method: 'DELETE',
    });

    const response =
      await PaymentGatewayService.requestHandler<ResponseType>(options);
    PaymentGatewayService.handleResult(response);
  }

  async getSessionAmount(checkoutId: string, type: string): Promise<number> {
    if (type === 'offer') {
      const offer = await prisma.offers.findFirst({
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
      if (!offer) throw new ApiError('Offer not found', 404);
      const totalPrice =
        offer.user_app_share +
        offer.price +
        offer.Trip.user_debt -
        offer.app_share_discount -
        offer.Trip.discount;
      return totalPrice;
    }
    const passenger = await prisma.passenger_Trip.findFirst({
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
    if (!passenger) throw new ApiError('Trip not found', 404);
    const totalprice =
      passenger.user_debt +
      passenger.user_app_share +
      passenger.Basic_Trip.price_per_seat -
      passenger.discount -
      passenger.app_share_discount;
    return totalprice;
  }
}

const paymentGatewayService = new PaymentGatewayService();
export default paymentGatewayService;
