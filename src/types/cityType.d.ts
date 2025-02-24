import { QueryType } from './queryType';

export interface City {
  id: number;
  ar_name: string;
  en_name: string;
  postcode: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export type CreateCity = Omit<
  City,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;
export type UpdateCity = Partial<CreateCity>;
export type CityQueryType = QueryType & {};
