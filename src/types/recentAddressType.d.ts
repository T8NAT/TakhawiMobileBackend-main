export interface RecentAddress {
  id: number;
  lat: number;
  lng: number;
  alias: string | null;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
}

export type CreateRecentAddress = Omit<
  RecentAddress,
  'id' | 'createdAt' | 'updatedAt'
>;
