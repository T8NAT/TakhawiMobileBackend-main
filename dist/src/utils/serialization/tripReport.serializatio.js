"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeTripReports = exports.serializeTripReportObject = void 0;
const serializeBasicTrip = (basicTrip, language) => ({
    pickup_location: {
        ...basicTrip.Pickup_Location?.location,
        description: basicTrip.Pickup_Location?.[`${language}_name`],
    },
    destination: {
        ...basicTrip.Destination?.location,
        description: basicTrip.Destination?.[`${language}_name`],
    },
    price_per_seat: undefined,
    passengers: basicTrip.Passengers ? basicTrip.Passengers.map((passenger) => ({
        name: passenger.Passnger?.name,
        avatar: passenger.Passnger?.avatar,
        passenger_rate: passenger.Passnger?.passenger_rate,
        payment_method: passenger.payment_method,
        cost: basicTrip.price_per_seat,
        discount: passenger.discount,
        compensation: passenger.app_share_discount,
        app_commission: passenger.driver_app_share,
        net_profit: basicTrip.price_per_seat - passenger.driver_app_share,
    })) : [],
});
const serializeVipTrip = (vipTrip, data) => ({
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
    passenger: vipTrip.Passnger,
    payment_method: vipTrip.payment_method,
    cost: data.price,
    discount: vipTrip.discount,
    compensation: vipTrip.app_share_discount,
    app_commission: vipTrip.user_app_share,
    net_profit: data.price - data.driver_app_share,
});
const serializeTripReportObject = (trip, language) => {
    const { VIP_Trip: vipTrip, Basic_Trip: basicTrip, driver_app_share, ...rest } = trip;
    const extra = vipTrip
        ? serializeVipTrip(vipTrip, { price: rest.price, driver_app_share })
        : serializeBasicTrip(basicTrip, language);
    return {
        ...rest,
        ...extra,
        net_profit: rest.price - driver_app_share,
    };
};
exports.serializeTripReportObject = serializeTripReportObject;
const serializeTripReports = (trips, language) => trips.map((trip) => (0, exports.serializeTripReportObject)(trip, language));
exports.serializeTripReports = serializeTripReports;
