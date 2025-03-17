import { Warning } from '@prisma/client';
import { Language } from '../../types/languageType';
export declare const serializeWarning: (warning: Warning, lang: Language) => {
    type: string;
    id: number;
    location: import(".prisma/client").Prisma.JsonValue;
    createdAt: Date;
    expiration_date: Date | null;
};
export declare const serializeWarnings: (warnings: Warning[], lang: Language) => {
    type: string;
    id: number;
    location: import(".prisma/client").Prisma.JsonValue;
    createdAt: Date;
    expiration_date: Date | null;
}[];
