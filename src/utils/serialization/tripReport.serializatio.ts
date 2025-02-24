import { Language } from '../../types/languageType.d';
import { BasicTripSnippet } from '../../types/basicTripType';
import { VipTripSnippet } from '../../types/vipTripType';

const serializeBasicTrip = (
  basicTrip: BasicTripSnippet,
  language: Language,
) => ({
  pickup_location: {
    ...basicTrip.Pickup_Location?.location,
    description: basicTrip.Pickup_Location?.[`${language}_name`],
  },
  destination: {
    ...basicTrip.Destination?.location,
    description: basicTrip.Destination?.[`${language}_name`],
  },
  price_per_seat: undefined,
  passengers: basicTrip.Passengers
    ? basicTrip.Passengers.map((passenger) => ({
        name: passenger.Passnger?.name,
        avatar: passenger.Passnger?.avatar,
        passenger_rate: passenger.Passnger?.passenger_rate,
        payment_method: passenger.payment_method,
        cost: basicTrip.price_per_seat,
        discount: passenger.discount,
        compensation: passenger.app_share_discount,
        app_commission: passenger.driver_app_share,
        net_profit: basicTrip.price_per_seat - passenger.driver_app_share,
      }))
    : [],
});

const serializeVipTrip = (vipTrip: VipTripSnippet, data: any) => ({
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

export const serializeTripReportObject = (trip: any, language: Language) => {
  const {
    VIP_Trip: vipTrip,
    Basic_Trip: basicTrip,
    driver_app_share,
    ...rest
  } = trip;
  const extra = vipTrip
    ? serializeVipTrip(vipTrip, { price: rest.price, driver_app_share })
    : serializeBasicTrip(basicTrip, language);

  return {
    ...rest,
    ...extra,
    net_profit: rest.price - driver_app_share,
  };
};

export const serializeTripReports = (trips: any[], language: Language) =>
  trips.map((trip) => serializeTripReportObject(trip, language));
