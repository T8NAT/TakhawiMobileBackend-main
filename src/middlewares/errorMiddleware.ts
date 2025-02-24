import { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import ApiError from '../utils/ApiError';
import response from '../utils/response';
import { removeFilesOnError } from '../utils/fileHandler';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.file || req.files) {
    removeFilesOnError(req);
  }
  if (
    err instanceof multer.MulterError &&
    err.code === 'LIMIT_UNEXPECTED_FILE'
  ) {
    response(res, 400, { status: false, message: 'Too many files to upload.' });
  }
  err.statusCode = err.statusCode || 500;
  if (process.env.NODE_ENV === 'development') {
    response(res, err.statusCode, {
      status: false,
      message: err.message,
      stack: err.stack,
    });
  } else {
    response(res, err.statusCode, { status: false, message: err.message });
  }
};
