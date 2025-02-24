import { MeetingLocation } from '../../types/meetingLocationType';
import { Language } from '../../types/languageType';
import { serializeCity } from './city.serialization';

export const serializeMeetingLocation = (
  location: MeetingLocation,
  lang: Language,
) => {
  const { ar_name: arName, en_name: enName, ...rest } = location;
  return {
    ...rest,
    name: location[`${lang}_name`],
    City: location.City ? serializeCity(location.City, lang) : undefined,
  };
};

export const serializeMeetingLocations = (
  locations: MeetingLocation[],
  lang: Language,
) => locations.map((location) => serializeMeetingLocation(location, lang));
