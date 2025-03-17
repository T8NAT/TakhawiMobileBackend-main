"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeTripList = exports.serializeTripObject = void 0;
const roles_1 = require("../../enum/roles");
const serializeBasicTrip = (basicTrip, language, role) => ({
    pickup_location: {
        ...basicTrip.Pickup_Location?.location,
        description: basicTrip.Pickup_Location?.[`${language}_name`],
    },
    destination: {
        ...basicTrip.Destination?.location,
        description: basicTrip.Destination?.[`${language}_name`],
    },
    passengerTripId: role !== roles_1.Roles.DRIVER
        && basicTrip.Passengers
        && basicTrip.Passengers?.length > 0
        ? basicTrip.Passengers[0].id
        : undefined,
    Passengers: role === roles_1.Roles.DRIVER ? basicTrip.Passengers : undefined,
});
const serializeVipTrip = (vipTrip) => ({
    payment_method: vipTrip.payment_method,
    pickup_location: {
        lat: vipTrip.pickup_location_lat,
        lng: vipTrip.pickup_location_lng,
        description: vipTrip.pickup_description,
    },
    destination: {
        lat: vipTrip.destination_location_lat,
        lng: vipTrip.destination_location_lng,
        description: vipTrip.destination_description,
    },
    Passenger: vipTrip.Passnger,
});
const serializeTripObject = (trip, language, role) => {
    const { VIP_Trip: vipTrip, Basic_Trip: basicTrip, ...rest } = trip;
    const extra = vipTrip
        ? serializeVipTrip(vipTrip)
        : serializeBasicTrip(basicTrip, language, role);
    return {
        ...rest,
        price: role === roles_1.Roles.DRIVER ? trip.price : undefined,
        ...extra,
    };
};
exports.serializeTripObject = serializeTripObject;
const serializeTripList = (trips, language, role) => trips.map((trip) => (0, exports.serializeTripObject)(trip, language, role));
exports.serializeTripList = serializeTripList;
