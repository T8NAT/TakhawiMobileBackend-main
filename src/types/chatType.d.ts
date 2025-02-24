import { User } from './userType';
import IMessage from './messageType';
import { QueryType } from './queryType';

export default interface IChat {
  id: string;
  userId: number;
  driverId: number;
  tripId: number;
  is_active: boolean;

  User?: User;
  Driver?: User;
  Messages?: IMessage[];
}

export type CreateChat = Omit<
  IChat,
  'id' | 'is_active' | 'User' | 'Driver' | 'Messages'
>;

export type ChatQuery = Partial<QueryType & {}>;
