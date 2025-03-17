"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.customEventEmitter = void 0;
// THIS FILE TO APPLY OBSERVER PATTERN
const events_1 = require("events");
const socket_1 = require("./socket");
const vehicle_serialization_1 = require("./serialization/vehicle.serialization");
const driverService_1 = __importDefault(require("../services/driverService"));
const pushNotification_1 = __importDefault(require("./pushNotification"));
const client_1 = __importDefault(require("../../prisma/client"));
const roles_1 = require("../enum/roles");
const trip_1 = require("../enum/trip");
const waslService_1 = __importDefault(require("../services/waslService"));
const authService_1 = __importDefault(require("../services/authService"));
// Create an instance of EventEmitter
exports.customEventEmitter = new events_1.EventEmitter(); // WE EXPORT THIS SO WE CAN USE THIS INSTANCE TO EMIT EVENTS
const tripStatusMessages = (status) => {
    let arabicBody = '';
    let englishBody = '';
    let arabictitle = '';
    let englishtitle = '';
    switch (status) {
        case trip_1.TripStatus.ON_WAY:
            arabicBody = 'السائق في الطريق';
            englishBody = 'The driver is on the way';
            arabictitle = 'السائق في الطريق';
            englishtitle = 'Driver On The Way';
            break;
        case trip_1.TripStatus.ARRIVED:
            arabicBody = 'وصل سائقك! يُرجى التوجه إلى مكان الالتقاء.';
            englishBody = 'Your driver has arrived! Please head to the pickup location.';
            arabictitle = 'السائق وصل';
            englishtitle = 'Driver Arrived';
            break;
        case trip_1.TripStatus.INPROGRESS:
            arabicBody = 'بدأت رحلتك! استمتع بالرحلة';
            englishBody = 'Your ride has started! Enjoy your trip';
            arabictitle = 'بدأت رحلتك!';
            englishtitle = 'Your ride has started!';
            break;
        case trip_1.TripStatus.COMPLETED:
            arabicBody = 'انتهت رحلتك. شكرًا لاستخدامك خدمتنا!';
            englishBody = 'Your ride has ended. Thank you for using our service!';
            arabictitle = 'الرحلة انتهت';
            englishtitle = 'Trip Completed';
            break;
        default:
            break;
    }
    return {
        arabictitle,
        englishtitle,
        arabicBody,
        englishBody,
    };
};
// NOTIFICATION
exports.customEventEmitter.on('notification', (data) => {
    // 1- SEND NOTIFICATION TO USER ON SOCKET
    socket_1.io.to(data.User?.uuid).emit('notification', {
        id: data.id,
        title: data.User?.prefered_language === 'ar' ? data.ar_title : data.en_title,
        body: data.User?.prefered_language === 'ar' ? data.ar_body : data.en_body,
        type: data.type,
        is_read: data.is_read,
        createdAt: data.createdAt,
    });
    // 2- SEND PUSH NOTIFICATION TO USER
    if (data.User && data.User.User_FCM_Token && data.User.User_FCM_Token.length > 0) {
        (0, pushNotification_1.default)({
            title: data.User?.prefered_language === 'ar' ? data.ar_title : data.en_title,
            body: data.User?.prefered_language === 'ar' ? data.ar_body : data.en_body,
            tokens: data.User.User_FCM_Token.map((token) => token.token),
        });
    }
});
// NEW VIP TRIP
exports.customEventEmitter.on('newVipTrip', async (data) => {
    // 1- SEND NOTIFICATION TO DRIVER ON SOCKET
    const location = {
        lat: data.VIP_Trip.pickup_location_lat,
        lng: data.VIP_Trip.pickup_location_lng,
    };
    const distanceRanges = [10, 20, 25, 30];
    let drivers = [];
    const arabicDriversTokens = [];
    const englishDriversTokens = [];
    for (const range of distanceRanges) {
        // eslint-disable-next-line no-await-in-loop
        const nearestDrivers = await driverService_1.default.getNearestDrivers(location, data.gender, range);
        const trip = {
            id: data.id,
            status: data.status,
            start_date: data.start_date,
            features: data.features,
            passenger_id: data.VIP_Trip.passnger_id,
            passenger_phone: data.VIP_Trip.Passnger.phone,
            passenger_name: data.VIP_Trip.Passnger.name,
            passenger_avatar: data.VIP_Trip.Passnger.avatar,
            passenger_rate: data.VIP_Trip.Passnger.passenger_rate,
            pickup_location_lat: data.VIP_Trip.pickup_location_lat,
            pickup_location_lng: data.VIP_Trip.pickup_location_lng,
            pickup_description: data.VIP_Trip.pickup_description,
            destination_location_lat: data.VIP_Trip.destination_location_lat,
            destination_location_lng: data.VIP_Trip.destination_location_lng,
            destination_description: data.VIP_Trip.destination_description,
        };
        if (nearestDrivers.length > 0) {
            drivers = nearestDrivers.map((driver) => {
                if (driver.prefered_language === 'ar') {
                    arabicDriversTokens.push(...driver.tokens);
                }
                else {
                    englishDriversTokens.push(...driver.tokens);
                }
                return driver.uuid;
            });
            socket_1.io.to(drivers).emit('new vip trip', { ...trip, distance: range });
            break;
        }
    }
    // 2- SEND PUSH NOTIFICATION TO DRIVER
    if (arabicDriversTokens.length > 0) {
        await (0, pushNotification_1.default)({
            title: 'رحلة خاصة جديدة',
            body: 'يوجد رحلة خاصة جديدة بالمنطقة يمكنك ارسال عرضك',
            tokens: arabicDriversTokens,
        });
    }
    if (englishDriversTokens.length > 0) {
        await (0, pushNotification_1.default)({
            title: 'New VIP Trip',
            body: 'You have a new VIP Trip in the area. Hurry up and send your offer',
            tokens: englishDriversTokens,
        });
    }
});
// NEW OFFER
exports.customEventEmitter.on('newOffer', async (data) => {
    // 1- SEND NOTIFICATION TO USER ON SOCKET
    let Vehicles;
    if (data.offer.Driver
        && data.offer.Driver.Vehicles
        && data.offer.Driver.Vehicles.length > 0) {
        Vehicles = (0, vehicle_serialization_1.serializeVehicle)(data.offer.Driver.Vehicles[0], data.language);
    }
    const { Driver, ...offer } = data.offer;
    socket_1.io.to(data.roomId).emit('new offer', {
        ...offer,
        Driver: {
            ...Driver,
            Vehicles,
        },
    });
    // 2- SEND PUSH NOTIFICATION TO USER
    if (data.fcm_tokens.length > 0) {
        await (0, pushNotification_1.default)({
            title: data.language === 'ar' ? 'عرض جديد' : 'New Offer',
            body: data.language === 'ar' ? 'لديك عرض جديد' : 'You have a new offer',
            tokens: data.fcm_tokens.map((token) => token.token),
        });
    }
});
// OFFER ACCEPTED
exports.customEventEmitter.on('offerAccepted', async (data) => {
    // 1- SEND NOTIFICATION TO DRIVER ON SOCKET
    socket_1.io.to(data.roomId).emit('offer accepted', {});
    // 2- SEND PUSH NOTIFICATION TO DRIVER
    if (data.tokens.length > 0) {
        await (0, pushNotification_1.default)({
            title: data.language === 'ar' ? 'تم قبول عرضك' : 'Offer Accepted',
            body: data.language === 'ar' ? 'لقد تم قبول عرضك من قبل العميل' : 'Your offer has been accepted by the client',
            tokens: data.tokens.map((token) => token.token),
        });
    }
});
// DRIVER CANCELATION
exports.customEventEmitter.on('driverCancelation', async (data) => {
    const englishDriversTokens = [];
    const arabicDriversTokens = [];
    const sockets = [];
    let arabicBody = '';
    let englishBody = '';
    if (data.type === trip_1.TripType.VIPTRIP) {
        arabicBody = 'لقد قام السائق بإلغاء الرحله نعمل على توفير سائق بديل';
        englishBody = 'The driver has cancelled the trip. We are working on providing an alternative driver';
    }
    else {
        arabicBody = 'تم إلغاء الرحلة من قبل السائق';
        englishBody = 'The trip has been cancelled by the driver';
    }
    data.users.forEach((user) => {
        if (user.prefered_language === 'ar') {
            user.User_FCM_Tokens.forEach((token) => {
                arabicDriversTokens.push(token.token);
            });
        }
        else {
            user.User_FCM_Tokens.forEach((token) => {
                englishDriversTokens.push(token.token);
            });
        }
        sockets.push(user.uuid);
    });
    // 1- SEND NOTIFICATION TO DRIVER ON SOCKET
    socket_1.io.to(sockets).emit('driver cancelation', {});
    // 2- SEND PUSH NOTIFICATION TO DRIVER
    if (arabicDriversTokens.length > 0) {
        await (0, pushNotification_1.default)({
            title: 'إلغاء الرحلة',
            body: arabicBody,
            tokens: arabicDriversTokens,
        });
    }
    if (englishDriversTokens.length > 0) {
        await (0, pushNotification_1.default)({
            title: 'Trip Cancelation',
            body: englishBody,
            tokens: englishDriversTokens,
        });
    }
});
// USER CANCELATION
exports.customEventEmitter.on('userCancelation', async (data) => {
    // 1- SEND NOTIFICATION TO USER ON SOCKET
    socket_1.io.to(data.user.uuid).emit('user cancelation', {});
    // 2- SEND PUSH NOTIFICATION TO USER
    if (data.user.User_FCM_Tokens.length > 0 && data.type === trip_1.TripType.VIPTRIP) {
        await (0, pushNotification_1.default)({
            title: data.user.prefered_language === 'ar' ? 'إلغاء الرحلة' : 'Trip Cancelation',
            body: data.user.prefered_language === 'ar' ? 'تم إلغاء الرحلة من قبل العميل' : 'The trip has been cancelled by the client',
            tokens: data.user.User_FCM_Tokens.map((token) => token.token),
        });
    }
    else if (data.user.User_FCM_Tokens.length > 0 && data.type === trip_1.TripType.BASICTRIP) {
        await (0, pushNotification_1.default)({
            title: data.user.prefered_language === 'ar' ? 'إلغاء الحجز' : 'Booking Cancelation',
            body: data.user.prefered_language === 'ar' ? 'تم إلغاء المقعد في الرحلة' : 'The seat in the trip has been cancelled',
            tokens: data.user.User_FCM_Tokens.map((token) => token.token),
        });
    }
});
// DRIVER ON THE WAY
// DRIVER ARRIVED
// TRIP STARTED
// TRIP COMPLETED
exports.customEventEmitter.on('tripStatusUpdate', async (data) => {
    const englishDriversTokens = [];
    const arabicDriversTokens = [];
    const sockets = [];
    const messages = tripStatusMessages(data.status);
    data.users.forEach((user) => {
        if (user.prefered_language === 'ar') {
            user.User_FCM_Tokens.forEach((token) => {
                arabicDriversTokens.push(token.token);
            });
        }
        else {
            user.User_FCM_Tokens.forEach((token) => {
                englishDriversTokens.push(token.token);
            });
        }
        sockets.push(user.uuid);
    });
    // 1- SEND NOTIFICATION TO DRIVER ON SOCKET
    socket_1.io.to(sockets).emit('trip status change', { tripId: data.id, status: data.status, driverId: data.driverId });
    // 2- SEND PUSH NOTIFICATION TO DRIVER
    if (arabicDriversTokens.length > 0) {
        await (0, pushNotification_1.default)({
            title: messages.arabictitle,
            body: messages.arabicBody,
            tokens: arabicDriversTokens,
        });
    }
    if (englishDriversTokens.length > 0) {
        await (0, pushNotification_1.default)({
            title: messages.englishtitle,
            body: messages.englishBody,
            tokens: englishDriversTokens,
        });
    }
});
exports.customEventEmitter.on('newWarning', async (data) => {
    const { location, ...warning } = data;
    const users = await client_1.default.$queryRaw `
    SELECT *
    FROM (
      SELECT u.uuid, u.prefered_language, ARRAY_AGG(uft.token) AS tokens,
        2 * 6371 * asin(
          sqrt(
            (sin(radians((CAST(location->>'lat' AS FLOAT) - ${+location.lat}) / 2))) ^ 2
            + cos(radians(${+location.lat})) * cos(radians(CAST(location->>'lat' AS FLOAT)))
            * (sin(radians((CAST(location->>'lng' AS FLOAT) - ${+location.lng}) / 2))) ^ 2
          )
        ) as distance
      FROM "User" u
      LEFT JOIN "User_FCM_Token" uft ON u.id = uft."userId"
      WHERE u."role" = ${roles_1.Roles.DRIVER}
      GROUP BY u.uuid, u.prefered_language, u.location
    ) AS subquery 
    WHERE distance < 100
    ORDER BY distance
  `;
    const arabicFCMToken = [];
    const englishFCMToken = [];
    users.forEach((user) => {
        if (user.prefered_language === 'ar') {
            arabicFCMToken.push(...user.tokens);
            socket_1.io.to(user.uuid).emit('newWarning', {
                type: warning.ar_type,
                distance: user.distance,
                location: data.location,
            });
        }
        else {
            englishFCMToken.push(...user.tokens);
            socket_1.io.to(user.uuid).emit('newWarning', {
                type: warning.en_type,
                distance: user.distance,
                location: data.location,
            });
        }
    });
    if (englishFCMToken.length > 0) {
        (0, pushNotification_1.default)({
            title: 'New Warning',
            body: warning.en_type,
            tokens: englishFCMToken,
        });
    }
    if (arabicFCMToken.length > 0) {
        (0, pushNotification_1.default)({
            title: 'تحذير جديد',
            body: warning.ar_type,
            tokens: arabicFCMToken,
        });
    }
});
exports.customEventEmitter.on('endTrip', async (data) => {
    await waslService_1.default.createTripRegistration(data);
});
exports.customEventEmitter.on('user-signup', async (user) => {
    await authService_1.default.sendVerificationCode(user.id);
});
