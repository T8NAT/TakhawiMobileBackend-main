import { ISavedCardService } from '../interfaces/savedCardService';
import { CreateUserBillingInfo } from '../types/paymentGatewayType';
import { SavedCardType } from '../types/savedCardType';
declare class SavedCardService implements ISavedCardService {
    create(userId: number): Promise<string>;
    getOne(id: number, user_id: number): Promise<SavedCardType>;
    delete(id: number, user_id: number): Promise<void>;
    getAll(userId: number): Promise<Omit<SavedCardType, 'token' | 'recurringAgreementId' | 'initialTransactionId'>[]>;
    createUserBillingInfo(data: CreateUserBillingInfo): Promise<void>;
    getUserBillingInfo(userId: number): Promise<{
        id: number;
        street: string;
        surname: string;
        state: string;
        createdAt: Date;
        userId: number;
    }>;
}
declare const savedCardService: SavedCardService;
export default savedCardService;
