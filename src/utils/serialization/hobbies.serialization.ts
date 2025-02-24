import { Hobby } from '../../types/hobbyType';
import { Language } from '../../types/languageType';

export const serializeHobby = (hobby: Hobby, lang: Language) => {
  const { ar_name: arName, en_name: enName, ...rest } = hobby;
  return {
    ...rest,
    name: hobby[`${lang}_name`],
  };
};

export const serializeHobbies = (hobbies: Hobby[], lang: Language) =>
  hobbies.map((hobby) => serializeHobby(hobby, lang));
