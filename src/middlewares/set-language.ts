import { Request, Response, NextFunction } from 'express';
import CustomRequest from '../interfaces/customRequest';
import { Language } from '../types/languageType';
import i18n from '../utils/i18n';

export default function setLanguage(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const language = (req.headers['accept-language'] as Language) || 'en';
  (req as CustomRequest).language = language;
  (req as CustomRequest).skipLang = !!(
    req.headers.localization && req.headers.localization === 'false'
  );
  i18n.setLocale(language); // Used to set the language for the i18n library in Socket.IO
  next();
}
