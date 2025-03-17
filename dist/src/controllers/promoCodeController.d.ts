import { Request, Response, NextFunction } from 'express';
declare class PromoCodeController {
    create(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAll(req: Request, res: Response, next: NextFunction): Promise<void>;
    getOne(req: Request, res: Response, next: NextFunction): Promise<void>;
    update(req: Request, res: Response, next: NextFunction): Promise<void>;
    delete(req: Request, res: Response, next: NextFunction): Promise<void>;
    checkPromoCode(req: Request, res: Response, next: NextFunction): Promise<void>;
}
declare const promoCodeController: PromoCodeController;
export default promoCodeController;
