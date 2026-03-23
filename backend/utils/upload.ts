import multer from 'multer';
import fs from 'fs';
import path from 'path';

export const appDir = process.cwd();

export const createUpload = (subDir: string) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = path.join(appDir, 'uploads', subDir);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });

  return multer({ storage });
};

export const getFileUrl = (req: any, subDir: string, filename: string) => {
  const protocol = req.protocol || 'http';
  return `${protocol}://${req.headers.host}/files/${subDir}/${filename}`;
};
