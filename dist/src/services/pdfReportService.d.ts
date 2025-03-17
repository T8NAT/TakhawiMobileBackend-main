/// <reference types="pdfkit" />
declare class PdfReportService {
    generateDriverTripReportPdf(driverId: number, tripId: number): Promise<PDFKit.PDFDocument>;
    generateUserTripReportPdf(userId: number, tripId: number): Promise<PDFKit.PDFDocument>;
}
declare const pdfReportService: PdfReportService;
export default pdfReportService;
