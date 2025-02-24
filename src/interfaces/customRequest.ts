import { Request } from 'express';
import { Language } from '../types/languageType';

export default interface CustomRequest extends Request {
  user: number;
  role: string;
  gender: string;
  temp_id: string;
  language: Language;
  skipLang: boolean;
  lat: number;
  lng: number;
}
