import { PaginateType } from '../types/paginateType';
import { User, CreateUser, UpdateUser, UserQueryType } from '../types/userType';

export interface IUserService {
  create(data: CreateUser): Promise<Partial<User>>;
  getAll(queryString: UserQueryType): Promise<PaginateType<User>>;
  getOne(id: number): Promise<Partial<User>>;
  getProfile(id: number): Promise<Partial<User>>;
  updateProfile(id: number, data: UpdateUser): Promise<Partial<User>>;
  deleteProfile(id: number): Promise<void>;
}
