"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __importDefault(require("../../prisma/client"));
const payment_1 = require("../enum/payment");
const trip_1 = require("../enum/trip");
const wallet_1 = require("../enum/wallet");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const paymentGatewayService_1 = __importDefault(require("./paymentGatewayService"));
const promoCodeService_1 = __importDefault(require("./promoCodeService"));
class OfferService {
    async applepayAcceptOffer(transactionId) {
        const offer = await client_1.default.offers.findFirst({
            where: {
                transactionId,
            },
        });
        await paymentGatewayService_1.default.getPaymentStatus(transactionId);
        if (!offer)
            throw new ApiError_1.default('Offer not found', 404);
        await client_1.default.$transaction(async (tx) => {
            const trip = await tx.vIP_Trip.update({
                where: {
                    trip_id: offer.trip_id,
                },
                data: {
                    payment_status: payment_1.PaymentStatus.SUCCESS,
                    Trip: {
                        update: {
                            status: trip_1.TripStatus.ACCEPTED,
                        },
                    },
                    Offers: {
                        update: {
                            where: {
                                id: offer.id,
                            },
                            data: {
                                status: trip_1.OfferStatus.ACCEPTED,
                            },
                        },
                    },
                },
                include: {
                    Passnger: {
                        select: {
                            user_wallet_balance: true,
                        },
                    },
                },
            });
            if (offer.app_share_discount > 0) {
                await tx.user.update({
                    where: {
                        id: trip.passnger_id,
                    },
                    data: {
                        discount_app_share_count: {
                            decrement: 1,
                        },
                    },
                });
            }
            if (trip.user_debt > 0) {
                await tx.user.update({
                    where: {
                        id: trip.passnger_id,
                    },
                    data: {
                        user_wallet_balance: {
                            increment: trip.user_debt,
                        },
                        Passenger_Wallet_Transaction: {
                            create: {
                                amount: trip.user_debt,
                                transaction_type: wallet_1.TransactionType.DEBT_PAYMENT,
                                previous_balance: trip.Passnger.user_wallet_balance,
                                current_balance: 0,
                                trip_id: offer.trip_id,
                            },
                        },
                    },
                });
            }
        });
        const driver = await client_1.default.user.findUnique({
            where: {
                id: offer.driver_id,
            },
            select: {
                uuid: true,
                User_FCM_Tokens: true,
                prefered_language: true,
            },
        });
        return {
            tokens: driver?.User_FCM_Tokens || [],
            roomId: driver?.uuid || '',
            language: driver?.prefered_language || 'en',
        };
    }
    async makeOffer(trip_id, gender, data) {
        const [trip, offersCount, vehicle] = await Promise.all([
            client_1.default.vIP_Trip.findUnique({
                where: {
                    trip_id,
                    Trip: {
                        gender,
                    },
                },
                include: {
                    Trip: {
                        select: {
                            status: true,
                        },
                    },
                },
            }),
            client_1.default.vIP_Trip.count({
                where: {
                    Trip: {
                        status: trip_1.TripStatus.PENDING,
                    },
                    Offers: {
                        some: {
                            driver_id: data.driver_id,
                            status: trip_1.OfferStatus.PENDING,
                        },
                    },
                },
            }),
            client_1.default.vehicle.findFirst({
                where: {
                    driverId: data.driver_id,
                    deletedAt: null,
                },
            }),
        ]);
        if (!trip)
            throw new ApiError_1.default('Trip not found', 404);
        if (!vehicle)
            throw new ApiError_1.default('Driver has no vehicle', 400);
        if (trip.Trip.status !== trip_1.TripStatus.PENDING)
            throw new ApiError_1.default('Trip is not accepting offers any more', 400);
        if (offersCount > 0)
            throw new ApiError_1.default('You already have an active offer', 400);
        let appShareDiscount = 0;
        const user = await client_1.default.user.findUnique({
            where: {
                id: trip.passnger_id,
            },
            select: {
                discount_app_share_count: true,
            },
        });
        if (user && user.discount_app_share_count > 0) {
            appShareDiscount = 18;
        }
        return client_1.default.offers.create({
            data: {
                ...data,
                features: {
                    set: data.features,
                },
                user_app_share: 18,
                app_share_discount: appShareDiscount,
                status: trip_1.OfferStatus.PENDING,
                trip_id,
                vehicle_id: vehicle.id,
            },
            include: {
                Trip: {
                    select: {
                        Passnger: {
                            select: {
                                uuid: true,
                                prefered_language: true,
                                User_FCM_Tokens: true,
                            },
                        },
                    },
                },
                Driver: {
                    select: {
                        name: true,
                        avatar: true,
                        driver_rate: true,
                        Vehicles: {
                            where: {
                                deletedAt: null,
                            },
                            select: {
                                id: true,
                                serial_no: true,
                                plate_alphabet: true,
                                plate_alphabet_ar: true,
                                plate_number: true,
                                seats_no: true,
                                production_year: true,
                                Vehicle_Color: {
                                    select: {
                                        ar_name: true,
                                        en_name: true,
                                    },
                                },
                                Vehicle_Class: {
                                    select: {
                                        ar_name: true,
                                        en_name: true,
                                    },
                                },
                                Vehicle_Type: {
                                    select: {
                                        ar_name: true,
                                        en_name: true,
                                    },
                                },
                                Vehicle_Name: {
                                    select: {
                                        ar_name: true,
                                        en_name: true,
                                    },
                                },
                            },
                            take: 1,
                        },
                    },
                },
            },
        });
    }
    async acceptOffer(offerId, userId, data) {
        const offer = await client_1.default.offers.findUnique({
            where: {
                id: offerId,
                Trip: {
                    passnger_id: userId,
                },
                status: { in: [trip_1.OfferStatus.PENDING, trip_1.OfferStatus.PENDING_PAYMENT] },
            },
        });
        if (!offer)
            throw new ApiError_1.default('Offer Is not valid to accept', 400);
        if (data.payment_method === payment_1.PaymentMethod.WALLET) {
            await this.checkWalletValidity(data.tripPriceBreakdown.total_price, userId);
        }
        const trip = await client_1.default.vIP_Trip.findUnique({
            where: {
                trip_id: offer.trip_id,
                Trip: {
                    status: trip_1.TripStatus.PENDING,
                },
            },
        });
        if (!trip)
            throw new ApiError_1.default('Trip not found', 404);
        await client_1.default.$transaction(async (tx) => {
            const trip = await tx.vIP_Trip.update({
                where: {
                    trip_id: offer.trip_id,
                },
                data: {
                    payment_method: data.payment_method,
                    payment_status: data.payment_method === payment_1.PaymentMethod.WALLET
                        ? payment_1.PaymentStatus.SUCCESS
                        : payment_1.PaymentStatus.PENDING,
                    app_share_discount: data.tripPriceBreakdown.has_app_share_discount ? data.tripPriceBreakdown.app_share : 0,
                    user_app_share: data.tripPriceBreakdown.app_share,
                    user_debt: data.tripPriceBreakdown.debt,
                    Promo_Code: data.tripPriceBreakdown.promo_code_id
                        ? {
                            // throw an error if i set the promoCodeId directlly
                            connect: {
                                id: data.tripPriceBreakdown.promo_code_id,
                            },
                        }
                        : undefined,
                    discount: data.tripPriceBreakdown.discount,
                    Trip: {
                        update: {
                            status: data.payment_method === payment_1.PaymentMethod.APPLEPAY ? trip_1.TripStatus.PENDING : trip_1.TripStatus.ACCEPTED,
                            price: offer.price,
                            discount: data.tripPriceBreakdown.discount,
                            driver_id: offer.driver_id,
                            vehicle_id: offer.vehicle_id,
                        },
                    },
                    Offers: {
                        updateMany: [
                            {
                                where: {
                                    trip_id: offer.trip_id,
                                    id: { not: offerId },
                                },
                                data: {
                                    status: trip_1.OfferStatus.REJECTED,
                                },
                            },
                            {
                                where: {
                                    id: offerId,
                                },
                                data: {
                                    status: data.payment_method === payment_1.PaymentMethod.APPLEPAY ? trip_1.OfferStatus.PENDING_PAYMENT : trip_1.OfferStatus.ACCEPTED,
                                    transactionId: data.transactionId,
                                },
                            },
                        ],
                    },
                },
            });
            if (data.payment_method === payment_1.PaymentMethod.WALLET) {
                const user = await tx.user.findUnique({
                    where: {
                        id: userId,
                    },
                });
                const userWallet = user?.user_wallet_balance || 0;
                await tx.user.update({
                    where: {
                        id: userId,
                    },
                    data: {
                        user_wallet_balance: {
                            decrement: data.tripPriceBreakdown.total_price,
                        },
                        Passenger_Wallet_Transaction: {
                            create: {
                                amount: -data.tripPriceBreakdown.total_price,
                                transaction_type: wallet_1.TransactionType.BOOK_TRIP,
                                previous_balance: userWallet,
                                current_balance: userWallet - data.tripPriceBreakdown.total_price,
                                trip_id: offer.trip_id,
                            },
                        },
                    },
                });
            }
            else if (data.tripPriceBreakdown.user_wallet_balance < 0
                && data.payment_method === payment_1.PaymentMethod.CASH) {
                await tx.user.update({
                    where: {
                        id: userId,
                    },
                    data: {
                        user_wallet_balance: {
                            increment: data.tripPriceBreakdown.user_wallet_balance * -1,
                        },
                        Passenger_Wallet_Transaction: {
                            create: {
                                amount: data.tripPriceBreakdown.user_wallet_balance * -1,
                                transaction_type: wallet_1.TransactionType.DEBT_PAYMENT,
                                previous_balance: data.tripPriceBreakdown.user_wallet_balance,
                                current_balance: 0,
                                trip_id: offer.trip_id,
                            },
                        },
                    },
                });
            }
            if (offer.app_share_discount > 0 && data.payment_method !== payment_1.PaymentMethod.APPLEPAY) {
                await tx.user.update({
                    where: {
                        id: userId,
                    },
                    data: {
                        discount_app_share_count: {
                            decrement: 1,
                        },
                    },
                });
            }
            return trip;
        });
        const driver = await client_1.default.user.findUnique({
            where: {
                id: offer.driver_id,
            },
            select: {
                uuid: true,
                User_FCM_Tokens: true,
                prefered_language: true,
            },
        });
        return {
            tokens: driver?.User_FCM_Tokens || [],
            roomId: driver?.uuid || '',
            language: driver?.prefered_language || 'en',
        };
    }
    async rejectOffer(offerId, userId) {
        const offer = await client_1.default.offers.findUnique({
            where: {
                id: offerId,
                Trip: {
                    passnger_id: userId,
                },
                status: trip_1.OfferStatus.PENDING,
            },
        });
        if (!offer)
            throw new ApiError_1.default('Offer not found', 404);
        await client_1.default.offers.update({
            where: {
                id: offerId,
            },
            data: {
                status: trip_1.OfferStatus.REJECTED,
            },
        });
    }
    async checkWalletValidity(amount, userId) {
        const user = await client_1.default.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                user_wallet_balance: true,
            },
        });
        if (user?.user_wallet_balance < amount)
            throw new ApiError_1.default('Insufficient balance', 400);
    }
    async calculateOfferPrice(data) {
        const offer = await client_1.default.offers.findUnique({
            where: {
                id: data.offerId,
                Trip: {
                    passnger_id: data.userId,
                },
                status: trip_1.OfferStatus.PENDING,
            },
        });
        if (!offer)
            throw new ApiError_1.default('Offer not found', 404);
        let discount = 0;
        if (data.coupon) {
            const promoCode = await promoCodeService_1.default.applyPromoCode(data.coupon, data.userId, offer.price);
            discount = promoCode.discount;
        }
        const user = await client_1.default.user.findUnique({
            where: {
                id: data.userId,
            },
            select: {
                user_wallet_balance: true,
            },
        });
        const debt = user && user.user_wallet_balance < 0 ? user.user_wallet_balance * -1 : 0;
        const appShare = offer.user_app_share - offer.app_share_discount;
        return {
            price: offer.price,
            debt,
            app_share: appShare,
            discount,
            total_price: offer.price + appShare + debt - discount,
        };
    }
}
const offerService = new OfferService();
exports.default = offerService;
