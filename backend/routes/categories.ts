import express from 'express';
const router = express.Router();
import validate from '../middleware/validate';
import auth from '../middleware/auth';
import admin from '../middleware/admin';
import AppError from '../utils/AppError';
import { success, created, paginated, message } from '../utils/response';
import { validateModel } from '../models/category.model';
import { createUpload, getFileUrl } from '../utils/upload';
import prisma from '../db';
import { routeCache } from '../middleware/cache';

const upload = createUpload('categories');

// List Categories (paginated)
router.get('/', [auth, routeCache(60)], async (req: any, res: any) => {
  const pageNo = parseInt(req.query.pageNo as string, 10) || 0;
  const pageSize = parseInt(req.query.pageSize as string, 10) || 100;
  const name = (req.query.name as string) || '';

  const where = {
    name: { contains: name, mode: 'insensitive' as const },
  };

  const totalElements = await prisma.category.count({ where });
  const totalPages = Math.ceil(totalElements / pageSize);

  const data = await prisma.category.findMany({
    where,
    skip: pageNo * pageSize,
    take: pageSize,
    orderBy: { name: 'asc' as const },
  });

  return paginated(res, { data, totalElements, pageNo, totalPages });
});

// Get Single Category
router.get('/:id', [auth], async (req: any, res: any) => {
  const category = await prisma.category.findUnique({
    where: { id: req.params.id },
  });
  if (!category) throw new AppError('Category not found.', 404);
  return success(res, category);
});

// Create Category
router.post(
  '/',
  [auth, admin, upload.single('file'), validate(validateModel)],
  async (req: any, res: any) => {
    const { name } = req.body;

    const category = await prisma.category.create({
      data: {
        name,
        icon: req.file?.filename
          ? getFileUrl(req, 'categories', req.file.filename)
          : req.body.file || '',
      },
    });

    return created(res, category);
  },
);

// Update Category
router.put(
  '/:id',
  [auth, admin, upload.single('file'), validate(validateModel)],
  async (req: any, res: any) => {
    const { name } = req.body;

    try {
      const category = await prisma.category.update({
        where: { id: req.params.id },
        data: {
          name,
          icon: req.file?.filename
            ? getFileUrl(req, 'categories', req.file.filename)
            : req.body.file,
        },
      });
      return success(res, category);
    } catch (e) {
      throw new AppError('Category not found.', 404);
    }
  },
);

// Delete Category
router.delete('/:id', [auth, admin], async (req: any, res: any) => {
  try {
    await prisma.category.delete({ where: { id: req.params.id } });
    return message(res, 'Category deleted successfully.');
  } catch (e: any) {
    if (e.code === 'P2003') {
      throw new AppError('Cannot delete category because it is linked to existing courses.', 400);
    }
    throw new AppError('Category not found.', 404);
  }
});

export default router;
