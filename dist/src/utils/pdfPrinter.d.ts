/// <reference types="pdfkit" />
import { PdfType } from '../types/pdfType';
declare class PdfPrinter {
    private fontDescriptors;
    private printer;
    constructor();
    private createDocDefinition;
    createPdfDocument(data: PdfType): PDFKit.PDFDocument;
    convertTextToRtl: (text: string) => string;
}
declare const pdfPrinter: PdfPrinter;
export default pdfPrinter;
