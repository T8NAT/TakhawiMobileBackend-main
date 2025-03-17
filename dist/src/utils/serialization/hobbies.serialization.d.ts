import { Hobby } from '../../types/hobbyType';
import { Language } from '../../types/languageType';
export declare const serializeHobby: (hobby: Hobby, lang: Language) => {
    name: string;
    id: number;
    createdAt: Date;
    updatedAt: Date;
};
export declare const serializeHobbies: (hobbies: Hobby[], lang: Language) => {
    name: string;
    id: number;
    createdAt: Date;
    updatedAt: Date;
}[];
