import { Request, Response, NextFunction } from 'express';
declare class WalletController {
    getUserWalletHistory(req: Request, res: Response, next: NextFunction): Promise<void>;
    getDriverWalletHistory(req: Request, res: Response, next: NextFunction): Promise<void>;
    walletRecharge(req: Request, res: Response, next: NextFunction): Promise<void>;
}
declare const walletController: WalletController;
export default walletController;
