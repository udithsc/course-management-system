import express from 'express';
const router = express.Router();
import validate from '../middleware/validate';
import auth from '../middleware/auth';
import admin from '../middleware/admin';
import AppError from '../utils/AppError';
import { success, created, paginated, message } from '../utils/response';
import { validateModel } from '../models/author.model';
import { createUpload, getFileUrl } from '../utils/upload';
import prisma from '../db';

const upload = createUpload('authors');

import { paginate } from '../utils/pagination';

// List Authors (paginated)
router.get('/', [auth], async (req: any, res: any) => {
  const result = await paginate(prisma.author, req.query);
  return paginated(res, result);
});


// Get Single Author
router.get('/:id', [auth], async (req: any, res: any) => {
  const author = await prisma.author.findUnique({
    where: { id: req.params.id },
  });
  if (!author) throw new AppError('Author not found.', 404);
  return success(res, author);
});

// Create Author
router.post(
  '/',
  [auth, admin, upload.single('file'), validate(validateModel)],
  async (req: any, res: any) => {
    const { name, profession, email, mobile } = req.body;

    const author = await prisma.author.create({
      data: {
        name,
        profession,
        email: email || null,
        mobile: mobile ? mobile.toString() : null,
        image: req.file?.filename ? getFileUrl(req, 'authors', req.file.filename) : null,
      },
    });

    return created(res, author);
  },
);

// Update Author
router.put(
  '/:id',
  [auth, admin, upload.single('file'), validate(validateModel)],
  async (req: any, res: any) => {
    const { name, profession, email, mobile } = req.body;

    try {
      const author = await prisma.author.update({
        where: { id: req.params.id },
        data: {
          name,
          profession,
          email: email || null,
          mobile: mobile ? mobile.toString() : null,
          image: req.file?.filename ? getFileUrl(req, 'authors', req.file.filename) : req.body.file,
        },
      });
      return success(res, author);
    } catch (e) {
      throw new AppError('Author not found.', 404);
    }
  },
);

// Delete Author
router.delete('/:id', [auth, admin], async (req: any, res: any) => {
  try {
    await prisma.author.delete({ where: { id: req.params.id } });
    return message(res, 'Author deleted successfully.');
  } catch (e: any) {
    if (e.code === 'P2003') {
      throw new AppError(
        'Cannot delete author because they are assigned to existing courses.',
        400,
      );
    }
    throw new AppError('Author not found.', 404);
  }
});

export default router;
