import { Request, Response, NextFunction } from 'express';
import { AcceptedFileType } from '../types/files';
interface MulterFile {
    name: string;
    minCount: number;
    maxCount: number;
    isFilesRequired: boolean;
    acceptedFiles: AcceptedFileType[];
}
export declare const validateMulterType: (fileTypes: AcceptedFileType[], isFilesRequired?: boolean) => (req: Request, res: Response, next: NextFunction) => void;
export declare const validateMulterManyFilesType: (files: MulterFile[]) => (req: Request, res: Response, next: NextFunction) => void;
export declare const validateMulterArray: (fileTypes: string[], minFiles?: number, maxFiles?: number, isFilesRequired?: boolean) => (req: Request, res: Response, next: NextFunction) => void;
export {};
