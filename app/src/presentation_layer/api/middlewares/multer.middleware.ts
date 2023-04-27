import multer from 'multer';
import { Request } from 'express';
import { BadRequestError } from '../../../common/errors';

const allowedMimeTypes = ['image/png', 'image/jpeg', 'text/plain'];

const storage = multer.memoryStorage();

const fileFilter = (_: Request, file: Express.Multer.File, cb: Function) => {
  if (allowedMimeTypes.includes(file.mimetype)) cb(null, true);
  else
    cb(
      new BadRequestError(
        `Only ${allowedMimeTypes.join(' or ')} files are allowed!`,
      ),
      false,
    );
};

const multerMiddleware = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 2, // 2 MB
  },
});

export default multerMiddleware;
