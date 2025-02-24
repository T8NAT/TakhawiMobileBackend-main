import {
  Address,
  CreateAddress,
  UpdateAddress,
  AddressQueryType,
} from '../types/address';
import { PaginateType } from '../types/paginateType';

export interface IAddressService {
  create(data: CreateAddress, userId: number): Promise<Address>;
  getOne(id: number, userId: number): Promise<Address>;
  getAll(userId: number, is_favorite?: string): Promise<Address[]>;
  getAllAddresses(
    queryString: AddressQueryType,
    userId?: number,
  ): Promise<PaginateType<Address>>;
  update(id: number, data: UpdateAddress, userId: number): Promise<Address>;
  delete(id: number, userId: number): Promise<void>;
}
