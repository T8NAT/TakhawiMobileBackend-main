import { IAddressService } from '../interfaces/addressService';
import { Address, AddressQueryType, CreateAddress, UpdateAddress } from '../types/address';
import { PaginateType } from '../types/paginateType';
declare class AddressService implements IAddressService {
    create(data: CreateAddress, userId: number): Promise<Address>;
    getOne(id: number, userId: number): Promise<Address>;
    getAll(userId: number, is_favorite?: string): Promise<Address[]>;
    getAllAddresses(queryString: AddressQueryType, userId?: number): Promise<PaginateType<Address>>;
    update(id: number, data: UpdateAddress, userId: number): Promise<Address>;
    delete(id: number, userId: number): Promise<void>;
}
declare const addressService: AddressService;
export default addressService;
