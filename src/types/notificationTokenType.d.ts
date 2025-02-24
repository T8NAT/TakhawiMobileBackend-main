export type NotificationTokenType = {
  title: string;
  body: string;
  tokens: string[];
  imageUrl?: string;
};

export type SendNotificationType = NotificationTokenType & {
  userIds?: number[];
};
