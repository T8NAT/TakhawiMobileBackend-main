import { Request, Response, NextFunction } from 'express';
declare class DriverReportController {
    getDriverReportPerMonth(req: Request, res: Response, next: NextFunction): Promise<void>;
    getDriverProfitReport(req: Request, res: Response, next: NextFunction): Promise<void>;
    getOneTripReport(req: Request, res: Response, next: NextFunction): Promise<void>;
    tripReviewReport(req: Request, res: Response, next: NextFunction): Promise<void>;
    getDriverFinancialSummary(req: Request, res: Response, next: NextFunction): Promise<void>;
}
declare const driverReportController: DriverReportController;
export default driverReportController;
