import { Request, Response, NextFunction } from 'express';
import { removeFile } from '../utils/fileHandler';
import ApiError from '../utils/ApiError';
import { AcceptedFileType } from '../types/files';

interface File {
  mimetype: string;
  path: string;
  // fieldname: string;
  // originalname: string;
  // encoding: string;
  // size: number;
  // destination: string;
  // filename: string;
  // buffer: Buffer;
}

interface MulterFile {
  name: string;
  minCount: number;
  maxCount: number;
  isFilesRequired: boolean;
  acceptedFiles: AcceptedFileType[];
}

export const validateMulterType =
  (fileTypes: AcceptedFileType[], isFilesRequired: boolean = true) =>
  (req: Request, res: Response, next: NextFunction): void => {
    if (isFilesRequired && !req.file) {
      return next(new ApiError('Please upload a file', 400));
    }

    if (req.file) {
      const fileType = req.file.mimetype.split('/')[1] as AcceptedFileType;
      if (!fileTypes.includes(fileType)) {
        removeFile(req.file.path);
        return next(
          new ApiError(
            `Invalid file type. Allowed types are: ${fileTypes.join(', ')}`,
            400,
          ),
        );
      }
    }

    next();
  };

export const validateMulterManyFilesType =
  (files: MulterFile[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const requestFiles =
      (req.files as { [fieldname: string]: Express.Multer.File[] }) || {};

    files.forEach((file) => {
      const uploadedKeys = Object.keys(requestFiles);

      if (file.isFilesRequired && !uploadedKeys.includes(file.name)) {
        return next(new ApiError(`Please upload ${file.name} file`, 400));
      }

      if (requestFiles[file.name]) {
        if (requestFiles[file.name].length > file.maxCount) {
          return next(
            new ApiError(
              `You can upload a maximum of ${file.maxCount} files`,
              400,
            ),
          );
        }
        if (requestFiles[file.name].length < file.minCount) {
          return next(
            new ApiError(
              `You must upload at least ${file.minCount} files`,
              400,
            ),
          );
        }
        requestFiles[file.name].forEach((f: Express.Multer.File) => {
          const fileType = f.mimetype.split('/')[1];
          if (!file.acceptedFiles.includes(fileType as AcceptedFileType)) {
            removeFile(f.path);
            return next(
              new ApiError(
                `Invalid file type. Allowed types are: ${file.acceptedFiles.join(', ')}`,
                400,
              ),
            );
          }
        });
      }
    });

    next();
  };

export const validateMulterArray =
  (
    fileTypes: string[],
    minFiles: number = 0,
    maxFiles: number = Infinity,
    isFilesRequired: boolean = true,
  ) =>
  (req: Request, res: Response, next: NextFunction): void => {
    if (!isFilesRequired) return next();

    if (!req.files) {
      return next(new ApiError('Please upload a file', 400));
    }
    const requestFiles = req.files as File[];

    if (requestFiles.length < minFiles) {
      return next(
        new ApiError(`Too few files. Minimum required is ${minFiles}`, 400),
      );
    }
    if (requestFiles.length > maxFiles) {
      return next(
        new ApiError(`Too many files. Maximum allowed is ${maxFiles}`, 400),
      );
    }

    requestFiles.forEach((f) => {
      const fileType = f.mimetype.split('/')[1];
      if (!fileTypes.includes(fileType)) {
        removeFile(f.path);
        return next(
          new ApiError(
            `Invalid file type. Allowed types are: ${fileTypes.join(', ')}`,
            400,
          ),
        );
      }
    });

    next();
  };
