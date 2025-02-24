import { Notification } from '../../types/notificationType';
import { Language } from '../../types/languageType';

export const serializeNotification = (
  notification: Notification,
  lang: Language,
) => {
  const {
    ar_title: arTitle,
    en_title: enTitle,
    ar_body: arBody,
    en_body: enBody,
    ...rest
  } = notification;
  return {
    ...rest,
    title: notification[`${lang}_title`],
    body: notification[`${lang}_body`],
  };
};

export const serializeNotifications = (
  notifications: Notification[],
  lang: Language,
) =>
  notifications.map((notification) =>
    serializeNotification(notification, lang),
  );
