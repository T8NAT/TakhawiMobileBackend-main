import { City } from '../../types/cityType';
import { Language } from '../../types/languageType';

export const serializeCity = (city: City, lang: Language) => {
  const { ar_name: arName, en_name: enName, ...rest } = city;
  return {
    ...rest,
    name: city[`${lang}_name`],
  };
};

export const serializeCities = (cities: City[], lang: Language) =>
  cities.map((city) => serializeCity(city, lang));
