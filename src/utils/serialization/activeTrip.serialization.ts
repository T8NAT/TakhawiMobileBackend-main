import { Language } from '../../types/languageType.d';
import { BasicTripSnippet } from '../../types/basicTripType';
import { VipTripSnippet } from '../../types/vipTripType';
import { Roles } from '../../enum/roles';
import { serializeVehicle } from './vehicle.serialization';

const basicTripPriceCalcolator = (
  basicTrip: BasicTripSnippet,
  role: string,
) => {
  const { Passengers } = basicTrip;
  if (role === Roles.USER && Passengers) {
    return (
      basicTrip.price_per_seat +
      Passengers[0].user_debt +
      Passengers[0].user_app_share -
      Passengers[0].discount -
      Passengers[0].app_share_discount
    );
  }
  return undefined;
};

const vipTripPriceCalcolator = (vipTrip: VipTripSnippet, price: number) =>
  price +
  vipTrip.user_debt +
  vipTrip.user_app_share -
  vipTrip.app_share_discount -
  vipTrip.discount;

const serializeBasicTrip = (
  basicTrip: BasicTripSnippet,
  language: Language,
  role: string,
) => ({
  pickup_location: {
    ...basicTrip.Pickup_Location?.location,
    description: basicTrip.Pickup_Location?.[`${language}_name`],
  },
  destination: {
    ...basicTrip.Destination?.location,
    description: basicTrip.Destination?.[`${language}_name`],
  },
  passengerTripId:
    role === Roles.USER && basicTrip.Passengers
      ? basicTrip.Passengers[0].id
      : undefined,
  Passengers: role === Roles.DRIVER ? basicTrip.Passengers : undefined,
  price:
    role === Roles.USER ? basicTripPriceCalcolator(basicTrip, role) : undefined, // THIS OVER RIDE THE REAL PRICE VALUE
});

const serializeVipTrip = (
  vipTrip: VipTripSnippet,
  price: number,
  role: string,
) => ({
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
  price:
    role === Roles.USER ? vipTripPriceCalcolator(vipTrip, price) : undefined, // THIS OVER RIDE THE REAL PRICE VALUE
});

export const serializeActiveTrip = (
  trip: any,
  language: Language,
  role: string,
) => {
  const { VIP_Trip: vipTrip, Basic_Trip: basicTrip, ...rest } = trip;
  const extra = vipTrip
    ? serializeVipTrip(vipTrip, trip.price, role)
    : serializeBasicTrip(basicTrip, language, role);
  return {
    ...rest,
    Vehicle: rest.Vehicle
      ? serializeVehicle(rest.Vehicle, language)
      : undefined,
    ...extra,
  };
};
