import { NextFunction, Request, Response } from 'express';
declare class OfferController {
    makeOffer(req: Request, res: Response, next: NextFunction): Promise<void>;
    acceptOffer(req: Request, res: Response, next: NextFunction): Promise<void>;
    rejectOffer(req: Request, res: Response, next: NextFunction): Promise<void>;
    applepayAcceptOffer(req: Request, res: Response): Promise<void>;
    calculateOfferPrice(req: Request, res: Response, next: NextFunction): Promise<void>;
}
declare const offerController: OfferController;
export default offerController;
