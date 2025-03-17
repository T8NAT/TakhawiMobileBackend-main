"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const node_schedule_1 = __importDefault(require("node-schedule"));
const client_1 = __importDefault(require("../../prisma/client"));
const trip_1 = require("../enum/trip");
const vipTripsToCancel = node_schedule_1.default.scheduleJob('0,30 * * * *', async () => {
    try {
        const time = (0, moment_1.default)().subtract(30, 'minutes').toDate();
        await client_1.default.trip.updateMany({
            where: {
                type: trip_1.TripType.VIPTRIP,
                status: trip_1.TripStatus.PENDING,
                start_date: {
                    lte: time,
                },
            },
            data: {
                status: trip_1.TripStatus.CANCELLED,
            },
        });
    }
    catch (error) {
        console.error('Error in terminating VIP trips:', error);
    }
});
exports.default = vipTripsToCancel;
