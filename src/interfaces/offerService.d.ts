import {
  AcceptOffer,
  AcceptOfferResponse,
  CreateOffer,
} from '../types/vipTripType';

export default class IOfferService {
  makeOffer(trip_id: number, gender: string, data: CreateOffer): Promise<any>;
  acceptOffer(
    offerId: number,
    userId: number,
    data: AcceptOffer,
  ): Promise<AcceptOfferResponse>;
  rejectOffer(offerId: number, userId: number): Promise<void>;
}
