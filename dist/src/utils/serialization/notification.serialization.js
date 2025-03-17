"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeNotifications = exports.serializeNotification = void 0;
const serializeNotification = (notification, lang) => {
    const { ar_title: arTitle, en_title: enTitle, ar_body: arBody, en_body: enBody, ...rest } = notification;
    return {
        ...rest,
        title: notification[`${lang}_title`],
        body: notification[`${lang}_body`],
    };
};
exports.serializeNotification = serializeNotification;
const serializeNotifications = (notifications, lang) => notifications.map((notification) => (0, exports.serializeNotification)(notification, lang));
exports.serializeNotifications = serializeNotifications;
