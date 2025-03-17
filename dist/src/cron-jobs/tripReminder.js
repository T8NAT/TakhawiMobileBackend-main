"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_schedule_1 = __importDefault(require("node-schedule"));
const moment_1 = __importDefault(require("moment"));
const client_1 = __importDefault(require("../../prisma/client"));
const pushNotification_1 = __importDefault(require("../utils/pushNotification"));
const trip_1 = require("../enum/trip");
const vipTripReminder = async (startTime, endTime) => {
    const trips = await client_1.default.vIP_Trip.findMany({
        where: {
            Trip: {
                start_date: {
                    gte: startTime,
                    lte: endTime,
                },
                status: {
                    notIn: [
                        trip_1.TripStatus.CANCELLED,
                        trip_1.TripStatus.COMPLETED,
                        trip_1.TripStatus.INPROGRESS,
                    ],
                },
            },
        },
        select: {
            Passnger: {
                select: {
                    prefered_language: true,
                    User_FCM_Tokens: true,
                },
            },
        },
    });
    if (trips.length > 0) {
        const arabicFCM = [];
        const englishFCM = [];
        trips.forEach((trip) => {
            if (trip.Passnger.prefered_language === 'ar') {
                arabicFCM.push(...trip.Passnger.User_FCM_Tokens.map((token) => token.token));
            }
            else {
                englishFCM.push(...trip.Passnger.User_FCM_Tokens.map((token) => token.token));
            }
        });
        if (arabicFCM.length > 0) {
            (0, pushNotification_1.default)({
                title: 'رحلتك على وشك البدء!',
                body: 'رحلتك على وشك البدء. يرجى التوجه إلى نقطة التجمع.',
                tokens: arabicFCM,
            });
        }
        if (englishFCM.length > 0) {
            (0, pushNotification_1.default)({
                title: 'Your trip is about to start!',
                body: 'Your trip is about to start. Please head to the meeting location.',
                tokens: englishFCM,
            });
        }
    }
};
const basicTripReminder = async (startTime, endTime) => {
    const trips = await client_1.default.basic_Trip.findMany({
        where: {
            Trip: {
                start_date: {
                    gte: startTime,
                    lte: endTime,
                },
                status: {
                    notIn: [
                        trip_1.TripStatus.CANCELLED,
                        trip_1.TripStatus.COMPLETED,
                        trip_1.TripStatus.INPROGRESS,
                    ],
                },
            },
        },
        select: {
            Passengers: {
                where: {
                    status: trip_1.PassengerTripStatus.JOINED,
                },
                select: {
                    Passnger: {
                        select: {
                            prefered_language: true,
                            User_FCM_Tokens: true,
                        },
                    },
                },
            },
        },
    });
    if (trips.length > 0) {
        const arabicFCM = [];
        const englishFCM = [];
        trips.forEach((trip) => {
            trip.Passengers.forEach((passenger) => {
                if (passenger.Passnger.prefered_language === 'ar') {
                    arabicFCM.push(...passenger.Passnger.User_FCM_Tokens.map((token) => token.token));
                }
                else {
                    englishFCM.push(...passenger.Passnger.User_FCM_Tokens.map((token) => token.token));
                }
            });
        });
        if (arabicFCM.length > 0) {
            (0, pushNotification_1.default)({
                title: 'رحلتك على وشك البدء!',
                body: 'رحلتك على وشك البدء. يرجى التوجه إلى نقطة التجمع.',
                tokens: arabicFCM,
            });
        }
        if (englishFCM.length > 0) {
            (0, pushNotification_1.default)({
                title: 'Your trip is about to start!',
                body: 'Your trip is about to start. Please head to the meeting location.',
                tokens: englishFCM,
            });
        }
    }
};
const tripReminder = node_schedule_1.default.scheduleJob('00 */5 * * * *', async () => {
    try {
        /*
        We need to limit this method to only run every 5 minutes to avoid overloading the server
        To avoid sending multiple notifications to the same user, we need to get the trip only once
        We need to get the trips that are scheduled to start in the next 15 minutes
        so if it's 12:00, we need to get the trips that are scheduled to start between 12:15 and 12:20
        when it runs again at 12:05, it will get the trips that are scheduled to start between 12:20 and 12:25
        so will avoid sending multiple notifications to the same user
        */
        const startTime = (0, moment_1.default)().add(15, 'minutes').toDate();
        const endTime = (0, moment_1.default)().add(20, 'minutes').toDate();
        await vipTripReminder(startTime, endTime);
        await basicTripReminder(startTime, endTime);
    }
    catch (error) {
        console.error('Error In Trip Reminder');
    }
});
exports.default = tripReminder;
