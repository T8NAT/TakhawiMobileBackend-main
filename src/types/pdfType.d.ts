import {
  Content,
  DynamicContent,
  Style,
  StyleDictionary,
} from 'pdfmake/interfaces';

export type PdfType = {
  content: Content;
  styles?: StyleDictionary;
  defaultStyle?: Style;
  header?: DynamicContent;
  footer?: DynamicContent;
};
