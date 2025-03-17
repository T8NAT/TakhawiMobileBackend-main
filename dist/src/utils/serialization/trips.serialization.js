"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeTrips = void 0;
const serializeBasicTrip = (basicTrip, language) => ({
    pickup_location: {
        ...basicTrip.Pickup_Location?.location,
        description: basicTrip.Pickup_Location?.[`${language}_name`],
    },
    destination: {
        ...basicTrip.Destination?.location,
        description: basicTrip.Destination?.[`${language}_name`],
    },
    passengers: basicTrip.Passengers,
});
const serializeVipTrip = (vipTrip) => ({
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
    Passnger: {
        id: vipTrip.Passnger?.id,
        name: vipTrip.Passnger?.name,
        avatar: vipTrip.Passnger?.avatar,
        passenger_rate: vipTrip.Passnger?.passenger_rate,
    },
});
const serializeTripObject = (trip, language) => {
    const { VIP_Trip: vipTrip, Basic_Trip: basicTrip, ...rest } = trip;
    const extra = vipTrip
        ? serializeVipTrip(vipTrip)
        : serializeBasicTrip(basicTrip, language);
    return {
        ...rest,
        ...extra,
    };
};
const serializeTrips = (trips, language) => trips.map((trip) => serializeTripObject(trip, language));
exports.serializeTrips = serializeTrips;
