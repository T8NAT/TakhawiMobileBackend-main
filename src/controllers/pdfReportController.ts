import { Request, Response, NextFunction } from 'express';
import pdfReportService from '../services/pdfReportService';
import CustomRequest from '../interfaces/customRequest';

class PdfReportController {
  async generateDriverTripReportPdf(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { user } = req as CustomRequest;
      const { tripId } = req.params;
      const { type } = req.query;
      const pdfDoc = await pdfReportService.generateDriverTripReportPdf(
        user,
        +tripId,
      );
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `${type === 'download' ? 'attachment' : 'inline'}; filename=trip-report.pdf`,
      );
      pdfDoc.pipe(res);
      pdfDoc.end();
    } catch (error) {
      next(error);
    }
  }

  async generateUserTripReportPdf(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { user } = req as CustomRequest;
      const { tripId } = req.params;
      const { type } = req.query;
      const pdfDoc = await pdfReportService.generateUserTripReportPdf(
        user,
        +tripId,
      );
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `${type === 'download' ? 'attachment' : 'inline'}; filename=trip-report.pdf`,
      );
      pdfDoc.pipe(res);
      pdfDoc.end();
    } catch (error) {
      next(error);
    }
  }
}
const pdfReportController = new PdfReportController();
export default pdfReportController;
