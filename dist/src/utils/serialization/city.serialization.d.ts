import { City } from '../../types/cityType';
import { Language } from '../../types/languageType';
export declare const serializeCity: (city: City, lang: Language) => {
    name: string;
    id: number;
    postcode: string | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
};
export declare const serializeCities: (cities: City[], lang: Language) => {
    name: string;
    id: number;
    postcode: string | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}[];
