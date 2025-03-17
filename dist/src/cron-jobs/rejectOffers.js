"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_schedule_1 = __importDefault(require("node-schedule"));
const moment_1 = __importDefault(require("moment"));
const client_1 = __importDefault(require("../../prisma/client"));
const trip_1 = require("../enum/trip");
// Reject offers that are pending for more than 3 minutes every minute
const rejectOffers = node_schedule_1.default.scheduleJob('00 * * * * *', async () => {
    try {
        const time = (0, moment_1.default)().subtract(3, 'minutes').toDate();
        await client_1.default.offers.updateMany({
            where: {
                status: trip_1.OfferStatus.PENDING,
                createdAt: {
                    lte: time,
                },
            },
            data: {
                status: trip_1.OfferStatus.REJECTED,
            },
        });
    }
    catch (error) {
        console.error('Error rejecting offers');
    }
});
exports.default = rejectOffers;
