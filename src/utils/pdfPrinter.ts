import PdfMake from 'pdfmake';
import { TDocumentDefinitions, TFontDictionary } from 'pdfmake/interfaces';
import { PdfType } from '../types/pdfType';

class PdfPrinter {
  private fontDescriptors: TFontDictionary = {
    Roboto: {
      normal: `${process.cwd()}/src/assets/fonts/Roboto/Roboto-Regular.ttf`,
      bold: `${process.cwd()}/src/assets/fonts/Roboto/Roboto-Medium.ttf`,
      italics: `${process.cwd()}/src/assets/fonts/Roboto/Roboto-Italic.ttf`,
      bolditalics: `${process.cwd()}/src/assets/fonts/Roboto/Roboto-MediumItalic.ttf`,
    },
    Kufi: {
      normal: `${process.cwd()}/src/assets/fonts/Kufi/Kufi-Regular.ttf`,
      bold: `${process.cwd()}/src/assets/fonts/Kufi/Kufi-Bold.ttf`,
    },
  };

  private printer: PdfMake;

  constructor() {
    this.printer = new PdfMake(this.fontDescriptors);
  }

  private createDocDefinition(data: PdfType): TDocumentDefinitions {
    return {
      pageSize: 'A4',
      pageMargins: [15, 15, 15, 15],
      header:
        data.header ??
        function header(currentPage, pageCount, pageSize) {
          return {
            columns: [
              {
                image: `${process.cwd()}/src/assets/images/header.png`,
                width: pageSize.width,
              },
            ],
          };
        },
      footer:
        data.footer ??
        function footer(currentPage, pageCount) {
          return {
            margin: [-1, -30, 0, 0],
            table: {
              widths: [300, 400],
              heights: [0, 0, 15],
              body: [
                [
                  {
                    text: 'Invoice from Takhawe - Thank you for choosing us!',
                    fontSize: 9,
                    color: '#00008B',
                    alignment: 'center',
                    border: [false, false, false, false],
                  },
                  {
                    text: `    Page ${currentPage.toString()} of ${pageCount.toString()}`,
                    fontSize: 9,
                    alignment: 'center',
                    color: '#00008B',
                    border: [false, false, false, false],
                  },
                ],
                [
                  {
                    text: '',
                    colSpan: 2,
                    width: 500,
                    fillColor: '#4A90E2',
                    border: [false, false, false, false],
                  },
                ],
                [
                  {
                    text: '',
                    colSpan: 2,
                    width: 500,
                    fillColor: '#D1E8E4',
                    border: [false, false, false, false],
                  },
                ],
                [
                  {
                    text: '',
                    colSpan: 2,
                    width: 500,
                    fillColor: '#D1E8E4',
                    border: [false, false, false, false],
                  },
                ],
              ],
            },
          };
        },
      styles: data.styles ?? {
        tableHeader: {
          font: 'Kufi',
          alignment: 'right',
          fontSize: 10,
          color: '#303F9F',
          bold: true,
        },
        arabicFont: {
          font: 'Kufi',
        },
        pageHeader: {
          fontSize: 14,
          alignment: 'right',
        },
        arabicRow: {
          font: 'Kufi',
          alignment: 'left',
        },
      },
      defaultStyle: data.defaultStyle ?? {
        font: 'Roboto',
      },
      content: data.content,
    };
  }

  public createPdfDocument(data: PdfType): PDFKit.PDFDocument {
    return this.printer.createPdfKitDocument(this.createDocDefinition(data));
  }

  public convertTextToRtl = (text: string) =>
    text.split(' ').reverse().join(' ');
}

const pdfPrinter = new PdfPrinter();
export default pdfPrinter;
