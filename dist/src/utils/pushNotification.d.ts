import { NotificationTokenType } from '../types/notificationTokenType';
declare const sendPushNotification: (data: NotificationTokenType) => Promise<void>;
export default sendPushNotification;
