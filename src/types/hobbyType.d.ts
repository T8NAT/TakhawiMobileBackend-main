import { QueryType } from './queryType';

export interface Hobby {
  id: number;
  en_name: string;
  ar_name: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateHobby = Omit<Hobby, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateHobby = Partial<CreateHobby>;
export type HobbyQueryType = QueryType & {};
