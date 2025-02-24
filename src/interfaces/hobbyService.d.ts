import {
  Hobby,
  CreateHobby,
  UpdateHobby,
  HobbyQueryType,
} from '../types/hobbyType';
import { PaginateType } from '../types/paginateType';

export interface IHobbyService {
  create(data: CreateHobby): Promise<Hobby>;
  getOne(id: number): Promise<Hobby>;
  getAll(queryString: HobbyQueryType): Promise<PaginateType<Hobby>>;
  update(id: number, data: UpdateHobby): Promise<Hobby>;
  delete(id: number): Promise<void>;
}
