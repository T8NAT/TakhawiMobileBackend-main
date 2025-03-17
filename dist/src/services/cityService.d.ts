import { City, CityQueryType, CreateCity, UpdateCity } from '../types/cityType';
import { ICityService } from '../interfaces/cityService';
import { PaginateType } from '../types/paginateType';
declare class CityService implements ICityService {
    create(data: CreateCity): Promise<City>;
    getOne(id: number): Promise<City>;
    getAll(queryString: CityQueryType): Promise<PaginateType<City>>;
    update(id: number, data: UpdateCity): Promise<City>;
    delete(id: number): Promise<void>;
}
declare const cityService: CityService;
export default cityService;
