import { IHobbyService } from '../interfaces/hobbyService';
import { CreateHobby, UpdateHobby, Hobby, HobbyQueryType } from '../types/hobbyType';
import { PaginateType } from '../types/paginateType';
declare class HobbyService implements IHobbyService {
    create(data: CreateHobby): Promise<Hobby>;
    getOne(id: number): Promise<Hobby>;
    getAll(queryString: HobbyQueryType): Promise<PaginateType<Hobby>>;
    update(id: number, data: UpdateHobby): Promise<Hobby>;
    delete(id: number): Promise<void>;
}
declare const hobbyService: HobbyService;
export default hobbyService;
