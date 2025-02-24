import { Content } from 'pdfmake/interfaces';
import pdfPrinter from '../utils/pdfPrinter';
import driverReportService from './driverReportService';
import { PdfType } from '../types/pdfType';

class PdfReportService {
  async generateDriverTripReportPdf(driverId: number, tripId: number) {
    // const trip = await driverReportService.getOneTripReport(driverId, tripId);
    const content: Content = [
      {
        columns: [
          {
            text: '1639172876 :',
            style: 'pageHeader',
            margin: [0, 185, -200, 0],
          },
          {
            text: pdfPrinter.convertTextToRtl(' رقم الفاتورة'),
            style: ['pageHeader', 'arabicFont'],
            margin: [0, 180, 12, 0],
          },
        ],
      },
      {
        columns: [
          {
            text: '1639172876 :',
            style: 'pageHeader',
            margin: [0, 10, -195, 30],
          },
          {
            text: pdfPrinter.convertTextToRtl(' تاريخ الفاتورة'),
            style: ['pageHeader', 'arabicFont'],
            margin: [0, 5, 12, 30],
          },
        ],
      },
      {
        table: {
          headerRows: 1,
          widths: [80, 45, 45, 83, 65, 45, 66, 65],
          body: [
            [
              {
                text: `${pdfPrinter.convertTextToRtl('المجموع شامل')} ${pdfPrinter.convertTextToRtl(
                  'قيمة الضريبة',
                )} المضاقة`,
                style: 'tableHeader',
              },
              {
                text: 'قيمة الضريبة',
                style: 'tableHeader',
              },
              {
                text: 'نسبة الضريبة',
                style: 'tableHeader',
              },
              {
                text: `${pdfPrinter.convertTextToRtl('المجموع الفرعي')} ${pdfPrinter.convertTextToRtl(
                  'بدون الضريبة',
                )} `,
                style: 'tableHeader',
              },
              {
                text: pdfPrinter.convertTextToRtl(' سعر الوحدة'),
                style: 'tableHeader',
              },
              { text: 'الكمية', style: 'tableHeader' },
              { text: 'الوصف', style: 'tableHeader' },
              {
                text: `${pdfPrinter.convertTextToRtl('تاريخ إستلام ')} ${pdfPrinter.convertTextToRtl(
                  'الضريبة',
                )} `,
                style: 'tableHeader',
              },
            ],
            [
              {
                columns: [
                  {
                    text: 'رس',
                    style: 'arabicRow',
                  },
                  {
                    text: '1000.00',
                    margin: [-18, 5, 0, 0],
                  },
                ],
              },
              {
                columns: [
                  {
                    text: 'رس',
                    style: 'arabicRow',
                  },
                  {
                    text: '1000.00',
                    margin: [-11, 5, 0, 0],
                  },
                ],
              },
              {
                text: '15 %',
                alignment: 'right',
                marginTop: 5,
              },
              {
                columns: [
                  {
                    text: 'رس',
                    style: 'arabicRow',
                  },
                  {
                    text: '1000.00',
                    margin: [-19, 5, 0, 0],
                  },
                ],
              },
              {
                columns: [
                  {
                    text: 'رس',
                    style: 'arabicRow',
                  },
                  {
                    text: '1000.00',
                    margin: [-11, 5, 0, 0],
                  },
                ],
              },
              { text: '1', alignment: 'center', margin: [2, 5, 0, 0] },
              {
                text: 'أجرة المشوار ',
                font: 'Kufi',
              },
              {
                text: '4/12/2023',
                alignment: 'right',
                marginTop: 5,
              },
            ],
          ],
        },
        layout: {
          hLineWidth(i, node) {
            if (i === node.table.body.length) {
              return 1;
            }
            if (i === 1) {
              return 1;
            }
            return 0;
          },
          vLineWidth() {
            return 0;
          },
          paddingLeft() {
            return 4;
          },
          paddingRight() {
            return 4;
          },
          paddingTop() {
            return 4;
          },
          paddingBottom() {
            return 4;
          },
        },
      },
      {
        columns: [
          {
            text: 'رس',
            font: 'Kufi',
            marginTop: 20,
          },
          {
            text: '10000',
            marginLeft: -150,
            marginTop: 25,
          },
          {
            text: ':',
            width: 10,
            marginLeft: -136,
            marginTop: 25,
            bold: true,
          },
          {
            text: pdfPrinter.convertTextToRtl(' المجموع بدون الضريبة'),
            font: 'Kufi',
            marginLeft: -147,
            width: 209,
            bold: true,
            marginTop: 20,
          },
        ],
      },
      {
        columns: [
          {
            text: 'رس',
            font: 'Kufi',
          },
          {
            text: '1000',
            marginLeft: -147,
            marginTop: 5,
          },
          {
            text: ':',
            width: 10,
            marginLeft: -174,
            marginTop: 5,
            bold: true,
          },
          {
            text: pdfPrinter.convertTextToRtl(' مجموع ضريبة القيمة المضافة'),
            font: 'Kufi',
            marginLeft: -184,
            width: 215,
            bold: true,
          },
        ],
      },
      {
        columns: [
          {
            text: 'رس',
            font: 'Kufi',
          },
          {
            text: '1000',
            marginLeft: -147,
            marginTop: 5,
          },
          {
            text: ':',
            width: 10,
            marginLeft: -200,
            marginTop: 5,
            bold: true,
          },
          {
            text: pdfPrinter.convertTextToRtl(
              ' المجموع مع ضريبة القيمة المضافة',
            ),
            font: 'Kufi',
            marginLeft: -210,
            width: 215,
            bold: true,
          },
        ],
      },
      {
        qr: 'https://www.google.com',
        foreground: '#FAFAFA',
        background: '#5C6BC0',
        fit: 150,
        margin: [30, 100, 0, 0],
      },
    ];
    const data: PdfType = {
      content,
    };
    const docDefinition = pdfPrinter.createPdfDocument(data);
    return docDefinition;
  }

  async generateUserTripReportPdf(userId: number, tripId: number) {
    // TODO: this will change after mark give us the params.
    // const trip = await driverReportService.getOneTripReport(userId, tripId);
    const content: Content = [
      {
        columns: [
          {
            text: '1639172876 :',
            style: 'pageHeader',
            margin: [0, 185, -200, 0],
          },
          {
            text: pdfPrinter.convertTextToRtl(' رقم الفاتورة'),
            style: ['pageHeader', 'arabicFont'],
            margin: [0, 180, 12, 0],
          },
        ],
      },
      {
        columns: [
          {
            text: '1639172876 :',
            style: 'pageHeader',
            margin: [0, 10, -195, 30],
          },
          {
            text: pdfPrinter.convertTextToRtl(' تاريخ الفاتورة'),
            style: ['pageHeader', 'arabicFont'],
            margin: [0, 5, 12, 30],
          },
        ],
      },
      {
        table: {
          headerRows: 1,
          widths: [80, 45, 45, 83, 65, 45, 66, 65],
          body: [
            [
              {
                text: `${pdfPrinter.convertTextToRtl('المجموع شامل')} ${pdfPrinter.convertTextToRtl(
                  'قيمة الضريبة',
                )} المضاقة`,
                style: 'tableHeader',
              },
              {
                text: 'قيمة الضريبة',
                style: 'tableHeader',
              },
              {
                text: 'نسبة الضريبة',
                style: 'tableHeader',
              },
              {
                text: `${pdfPrinter.convertTextToRtl('المجموع الفرعي')} ${pdfPrinter.convertTextToRtl(
                  'بدون الضريبة',
                )} `,
                style: 'tableHeader',
              },
              {
                text: pdfPrinter.convertTextToRtl(' سعر الوحدة'),
                style: 'tableHeader',
              },
              { text: 'الكمية', style: 'tableHeader' },
              { text: 'الوصف', style: 'tableHeader' },
              {
                text: `${pdfPrinter.convertTextToRtl('تاريخ إستلام ')} ${pdfPrinter.convertTextToRtl(
                  'الضريبة',
                )} `,
                style: 'tableHeader',
              },
            ],
            [
              {
                columns: [
                  {
                    text: 'رس',
                    style: 'arabicRow',
                  },
                  {
                    text: '1000.00',
                    margin: [-18, 5, 0, 0],
                  },
                ],
              },
              {
                columns: [
                  {
                    text: 'رس',
                    style: 'arabicRow',
                  },
                  {
                    text: '1000.00',
                    margin: [-11, 5, 0, 0],
                  },
                ],
              },
              {
                text: '15 %',
                alignment: 'right',
                marginTop: 5,
              },
              {
                columns: [
                  {
                    text: 'رس',
                    style: 'arabicRow',
                  },
                  {
                    text: '1000.00',
                    margin: [-19, 5, 0, 0],
                  },
                ],
              },
              {
                columns: [
                  {
                    text: 'رس',
                    style: 'arabicRow',
                  },
                  {
                    text: '1000.00',
                    margin: [-11, 5, 0, 0],
                  },
                ],
              },
              { text: '1', alignment: 'center', margin: [2, 5, 0, 0] },
              {
                text: 'أجرة المشوار ',
                font: 'Kufi',
              },
              {
                text: '4/12/2023',
                alignment: 'right',
                marginTop: 5,
              },
            ],
          ],
        },
        layout: {
          hLineWidth(i, node) {
            if (i === node.table.body.length) {
              return 1;
            }
            if (i === 1) {
              return 1;
            }
            return 0;
          },
          vLineWidth() {
            return 0;
          },
          paddingLeft() {
            return 4;
          },
          paddingRight() {
            return 4;
          },
          paddingTop() {
            return 4;
          },
          paddingBottom() {
            return 4;
          },
        },
      },
      {
        columns: [
          {
            text: 'رس',
            font: 'Kufi',
            marginTop: 20,
          },
          {
            text: '1000',
            marginLeft: -150,
            marginTop: 25,
          },
          {
            text: ':',
            width: 10,
            marginLeft: -136,
            marginTop: 25,
            bold: true,
          },
          {
            text: pdfPrinter.convertTextToRtl(' المجموع بدون الضريبة'),
            font: 'Kufi',
            marginLeft: -147,
            width: 209,
            bold: true,
            marginTop: 20,
          },
        ],
      },
      {
        columns: [
          {
            text: 'رس',
            font: 'Kufi',
          },
          {
            text: '1000',
            marginLeft: -147,
            marginTop: 5,
          },
          {
            text: ':',
            width: 10,
            marginLeft: -174,
            marginTop: 5,
            bold: true,
          },
          {
            text: pdfPrinter.convertTextToRtl(' مجموع ضريبة القيمة المضافة'),
            font: 'Kufi',
            marginLeft: -184,
            width: 215,
            bold: true,
          },
        ],
      },
      {
        columns: [
          {
            text: 'رس',
            font: 'Kufi',
          },
          {
            text: '1000',
            marginLeft: -147,
            marginTop: 5,
          },
          {
            text: ':',
            width: 10,
            marginLeft: -200,
            marginTop: 5,
            bold: true,
          },
          {
            text: pdfPrinter.convertTextToRtl(
              ' المجموع مع ضريبة القيمة المضافة',
            ),
            font: 'Kufi',
            marginLeft: -210,
            width: 215,
            bold: true,
          },
        ],
      },
      {
        qr: 'https://www.google.com',
        foreground: '#FAFAFA',
        background: '#5C6BC0',
        fit: 150,
        margin: [30, 100, 0, 0],
      },
    ];
    const data: PdfType = {
      content,
    };
    const docDefinition = pdfPrinter.createPdfDocument(data);
    return docDefinition;
  }
}

const pdfReportService = new PdfReportService();
export default pdfReportService;
