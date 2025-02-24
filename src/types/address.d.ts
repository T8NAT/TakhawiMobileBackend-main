import { QueryType } from './queryType';

export interface Address {
  id: number;
  lat: number;
  lng: number;
  alias: string;
  description: string | null;
  is_favorite: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  userId: number;
}

export type CreateAddress = Omit<
  Address,
  'id' | 'userId' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;
export type UpdateAddress = Partial<CreateAddress>;
export type AddressQueryType = QueryType & {};
