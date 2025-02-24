import { Language } from '../../types/languageType';
import { serializeHobbies } from './hobbies.serialization';

export const basicTripSerialization = (trip: any, lang: Language) => {
  const { Driver, ...rest } = trip;
  return {
    ...rest,
    Driver: {
      ...Driver,
      Hobbies: serializeHobbies(Driver.Hobbies, lang),
    },
  };
};
