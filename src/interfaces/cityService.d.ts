import { City, CreateCity, UpdateCity, CityQueryType } from '../types/cityType';
import { PaginateType } from '../types/paginateType';

export interface ICityService {
  create(data: CreateCity): Promise<City>;
  getOne(id: number): Promise<City>;
  getAll(queryString: CityQueryType): Promise<PaginateType<City>>;
  update(id: number, data: UpdateCity): Promise<City>;
  delete(id: number): Promise<void>;
}
