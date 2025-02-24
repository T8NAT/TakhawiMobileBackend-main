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
  passengers: basicTrip.Passengers,
});

const serializeVipTrip = (vipTrip: VipTripSnippet) => ({
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

const serializeTripObject = (trip: any, language: Language) => {
  const { VIP_Trip: vipTrip, Basic_Trip: basicTrip, ...rest } = trip;
  const extra = vipTrip
    ? serializeVipTrip(vipTrip)
    : serializeBasicTrip(basicTrip, language);
  return {
    ...rest,
    ...extra,
  };
};

export const serializeTrips = (trips: any[], language: Language) =>
  trips.map((trip) => serializeTripObject(trip, language));
