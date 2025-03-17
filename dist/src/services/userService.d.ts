import { IUserService } from '../interfaces/userService';
import { CreateUser, UpdateUser, User, UserQueryType } from '../types/userType';
import { PaginateType } from '../types/paginateType';
declare class UserService implements IUserService {
    create(data: CreateUser): Promise<Partial<User>>;
    getAll(queryString: UserQueryType): Promise<PaginateType<User>>;
    getDrivers(queryString: UserQueryType): Promise<PaginateType<User>>;
    getOne(id: number): Promise<Partial<User>>;
    getProfile(id: number): Promise<Partial<User>>;
    updateProfile(id: number, data: UpdateUser): Promise<Partial<User>>;
    deleteProfile(id: number): Promise<void>;
    getUserById(id: number): Promise<User>;
}
declare const userService: UserService;
export default userService;
