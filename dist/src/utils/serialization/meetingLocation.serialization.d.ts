import { MeetingLocation } from '../../types/meetingLocationType';
import { Language } from '../../types/languageType';
export declare const serializeMeetingLocation: (location: MeetingLocation, lang: Language) => {
    name: string;
    City: {
        name: string;
        id: number;
        postcode: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    } | undefined;
    id: number;
    location: JsonValue;
    cityId: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
};
export declare const serializeMeetingLocations: (locations: MeetingLocation[], lang: Language) => {
    name: string;
    City: {
        name: string;
        id: number;
        postcode: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    } | undefined;
    id: number;
    location: JsonValue;
    cityId: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}[];
