import { Language } from '../../types/languageType.d';
import { BasicTripSnippet } from '../../types/basicTripType';
import { VipTripSnippet } from '../../types/vipTripType';
import { Roles } from '../../enum/roles';

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
    role !== Roles.DRIVER &&
    basicTrip.Passengers &&
    basicTrip.Passengers?.length > 0
      ? basicTrip.Passengers[0].id
      : undefined,
  Passengers: role === Roles.DRIVER ? basicTrip.Passengers : undefined,
});

const serializeVipTrip = (vipTrip: VipTripSnippet) => ({
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

export const serializeTripObject = (
  trip: any,
  language: Language,
  role: string,
) => {
  const { VIP_Trip: vipTrip, Basic_Trip: basicTrip, ...rest } = trip;
  const extra = vipTrip
    ? serializeVipTrip(vipTrip)
    : serializeBasicTrip(basicTrip, language, role);
  return {
    ...rest,
    price: role === Roles.DRIVER ? trip.price : undefined,
    ...extra,
  };
};

export const serializeTripList = (
  trips: any[],
  language: Language,
  role: string,
) => trips.map((trip) => serializeTripObject(trip, language, role));
