import { Notification } from '../../types/notificationType';
import { Language } from '../../types/languageType';
export declare const serializeNotification: (notification: Notification, lang: Language) => {
    title: string;
    body: string;
    id: number;
    type: string;
    is_read: boolean;
    createdAt: Date;
    updatedAt: Date;
    userId: number;
    User?: import("../../types/userType").User | undefined;
};
export declare const serializeNotifications: (notifications: Notification[], lang: Language) => {
    title: string;
    body: string;
    id: number;
    type: string;
    is_read: boolean;
    createdAt: Date;
    updatedAt: Date;
    userId: number;
    User?: import("../../types/userType").User | undefined;
}[];
