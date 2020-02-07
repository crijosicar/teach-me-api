import { extname } from 'path';

export const editFileName = ({
  req,
  file,
  callback,
}: {
  req: Express.Request;
  file: Express.Multer.File;
  callback: CallableFunction;
}) => {
  const fileExtName = extname(file.originalname);
  const randomName = Array(20)
    .fill(undefined)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(undefined, `${randomName}${fileExtName}`);
};

export const imageFileFilter = ({
  req,
  file,
  callback,
}: {
  req: Express.Request;
  file: Express.Multer.File;
  callback: CallableFunction;
}) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/))
    callback(new Error('Only image files are allowed!'), false);

  callback(undefined, true);
};
