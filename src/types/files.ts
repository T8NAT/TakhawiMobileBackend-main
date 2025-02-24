export type AcceptedFileType =
  | 'jpg'
  | 'jpeg'
  | 'png'
  | 'pdf'
  | 'doc'
  | 'docx'
  | 'zip'
  | 'vnd.rar';

export type FileMap = {
  [key: string]: Express.Multer.File[];
};
