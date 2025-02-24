import multer from 'multer';
import createFolder from '../utils/folderHandler';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const fileType = file.mimetype.split('/')[1];
    const reqPath = req.originalUrl.split('/')[2];
    const path = `./uploads/${reqPath}/${fileType}`;
    createFolder(path);
    cb(null, path);
  },
  filename: (req, file, cb) => {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const uploadToDiskStorage = multer({ storage });

export default uploadToDiskStorage;
