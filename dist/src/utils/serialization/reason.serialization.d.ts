import { Reason } from '../../types/reasonType';
import { Language } from '../../types/languageType';
export declare const serializeReason: (reason: Reason, lang: Language) => {
    reason: string;
    id: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
};
export declare const serializeReasons: (reasons: Reason[], lang: Language) => {
    reason: string;
    id: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}[];
