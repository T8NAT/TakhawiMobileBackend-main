import { Request, Response, NextFunction } from 'express';
declare class PdfReportController {
    generateDriverTripReportPdf(req: Request, res: Response, next: NextFunction): Promise<void>;
    generateUserTripReportPdf(req: Request, res: Response, next: NextFunction): Promise<void>;
}
declare const pdfReportController: PdfReportController;
export default pdfReportController;
