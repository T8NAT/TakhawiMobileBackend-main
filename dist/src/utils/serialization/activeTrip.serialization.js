"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeActiveTrip = void 0;
const roles_1 = require("../../enum/roles");
const vehicle_serialization_1 = require("./vehicle.serialization");
const basicTripPriceCalcolator = (basicTrip, role) => {
    const { Passengers } = basicTrip;
    if (role === roles_1.Roles.USER && Passengers) {
        return (basicTrip.price_per_seat
            + Passengers[0].user_debt
            + Passengers[0].user_app_share
            - Passengers[0].discount
            - Passengers[0].app_share_discount);
    }
    return undefined;
};
const vipTripPriceCalcolator = (vipTrip, price) => (price
    + vipTrip.user_debt
    + vipTrip.user_app_share
    - vipTrip.app_share_discount
    - vipTrip.discount);
const serializeBasicTrip = (basicTrip, language, role) => ({
    pickup_location: {
        ...basicTrip.Pickup_Location?.location,
        description: basicTrip.Pickup_Location?.[`${language}_name`],
    },
    destination: {
        ...basicTrip.Destination?.location,
        description: basicTrip.Destination?.[`${language}_name`],
    },
    passengerTripId: role === roles_1.Roles.USER && basicTrip.Passengers
        ? basicTrip.Passengers[0].id
        : undefined,
    Passengers: role === roles_1.Roles.DRIVER ? basicTrip.Passengers : undefined,
    price: role === roles_1.Roles.USER ? basicTripPriceCalcolator(basicTrip, role) : undefined, // THIS OVER RIDE THE REAL PRICE VALUE
});
const serializeVipTrip = (vipTrip, price, role) => ({
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
    Passenger: vipTrip.Passnger ? vipTrip.Passnger : undefined,
    payment_method: vipTrip.payment_method,
    price: role === roles_1.Roles.USER ? vipTripPriceCalcolator(vipTrip, price) : undefined, // THIS OVER RIDE THE REAL PRICE VALUE
});
const serializeActiveTrip = (trip, language, role) => {
    const { VIP_Trip: vipTrip, Basic_Trip: basicTrip, ...rest } = trip;
    const extra = vipTrip
        ? serializeVipTrip(vipTrip, trip.price, role)
        : serializeBasicTrip(basicTrip, language, role);
    return {
        ...rest,
        Vehicle: rest.Vehicle
            ? (0, vehicle_serialization_1.serializeVehicle)(rest.Vehicle, language)
            : undefined,
        ...extra,
    };
};
exports.serializeActiveTrip = serializeActiveTrip;
