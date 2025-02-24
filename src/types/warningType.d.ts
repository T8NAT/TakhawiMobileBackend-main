export interface Warning {
  id: number;
  location: Json;
  ar_type: string;
  en_type: string;
  expiration_date: Date | null;
  createdAt: Date;
}

export type CreateWarningType = Omit<Warning, 'id' | 'createdAt'>;
export type WarningQueryType = Partial<{
  lat: number;
  lng: number;
}>;
