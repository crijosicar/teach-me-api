import { extname } from 'path';

export const editFileName = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: CallableFunction,
) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = Array(20)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${randomName}${fileExtName}`);
};

export const imageFileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: CallableFunction,
) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/))
    callback(new Error('Only image files are allowed!'), false);

  callback(null, true);
};
