import { Request, Response, NextFunction } from 'express';
declare class AdminDashboardController {
    getDriverStatistics(req: Request, res: Response, next: NextFunction): Promise<void>;
    getTripStatistics(req: Request, res: Response, next: NextFunction): Promise<void>;
    getPassengerTransactions(req: Request, res: Response, next: NextFunction): Promise<void>;
    getDriverTransactions(req: Request, res: Response, next: NextFunction): Promise<void>;
    generateEarningsReport(req: Request, res: Response, next: NextFunction): Promise<void>;
}
declare const adminDashboardController: AdminDashboardController;
export default adminDashboardController;
