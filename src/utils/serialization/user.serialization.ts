import { User } from '../../types/userType';
import { Language } from '../../types/languageType';
import { serializeHobbies } from './hobbies.serialization';
import { serializeCity } from './city.serialization';
import { serializeVehicle } from './vehicle.serialization';
import { Roles } from '../../enum/roles';

export const serializeUser = (
  user: User | Partial<User>,
  lang: Language,
  role: string,
) => {
  const { Hobbies, City, Vehicles, driver_rate, passenger_rate, ...rest } =
    user;
  return {
    ...rest,
    City: City ? serializeCity(City, lang) : undefined,
    Hobbies: Hobbies ? serializeHobbies(Hobbies, lang) : undefined,
    rate: role === Roles.DRIVER ? driver_rate : passenger_rate,
    Vehicles:
      role === Roles.DRIVER && Vehicles && Vehicles.length > 0
        ? serializeVehicle(Vehicles[0], lang)
        : null,
  };
};

export const serializeUsers = (users: User[], lang: Language) =>
  users.map((user) => serializeUser(user, lang, user.role));
