import { I18n } from 'i18n';
import path from 'path';
import { Languages } from '../enum/languages';

export default new I18n({
  locales: ['en', 'ar'],
  directory: path.join(__dirname, '../locales'),
  defaultLocale: Languages.ENGLISH,
  updateFiles: false, // If true, the locale file will be updated with the new key and restart the server
  syncFiles: true,
});
