export interface AppConfig {
  id: number;
  key: string;
  value: string;
  type?: string;
}

export type CreateAppConfig = Omit<AppConfig, 'id' | 'userId' | 'createdAt'>;
