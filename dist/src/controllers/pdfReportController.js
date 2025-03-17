"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pdfReportService_1 = __importDefault(require("../services/pdfReportService"));
class PdfReportController {
    async generateDriverTripReportPdf(req, res, next) {
        try {
            const { user } = req;
            const { tripId } = req.params;
            const { type } = req.query;
            const pdfDoc = await pdfReportService_1.default.generateDriverTripReportPdf(user, +tripId);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `${type === 'download' ? 'attachment' : 'inline'}; filename=trip-report.pdf`);
            pdfDoc.pipe(res);
            pdfDoc.end();
        }
        catch (error) {
            next(error);
        }
    }
    async generateUserTripReportPdf(req, res, next) {
        try {
            const { user } = req;
            const { tripId } = req.params;
            const { type } = req.query;
            const pdfDoc = await pdfReportService_1.default.generateUserTripReportPdf(user, +tripId);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `${type === 'download' ? 'attachment' : 'inline'}; filename=trip-report.pdf`);
            pdfDoc.pipe(res);
            pdfDoc.end();
        }
        catch (error) {
            next(error);
        }
    }
}
const pdfReportController = new PdfReportController();
exports.default = pdfReportController;
