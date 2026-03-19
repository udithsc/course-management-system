const router = require('express').Router();
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const AppError = require('../utils/AppError');
const { success, created, paginated, message } = require('../utils/response');
const { validateModel } = require('../models/category.model');
const { createUpload, getFileUrl } = require('../utils/upload');
const prisma = require('../db');

const upload = createUpload('categories');

// ─── List Categories (paginated) ────────────────────────
router.get('/', [auth], async (req, res) => {
  const pageNo = parseInt(req.query.pageNo, 10) || 0;
  const pageSize = parseInt(req.query.pageSize, 10) || 100;
  const name = req.query.name || '';

  const where = {
    name: { contains: name, mode: 'insensitive' },
  };

  const totalElements = await prisma.category.count({ where });
  const totalPages = Math.ceil(totalElements / pageSize);

  const data = await prisma.category.findMany({
    where,
    skip: pageNo * pageSize,
    take: pageSize,
    orderBy: { name: 'asc' },
  });

  return paginated(res, { data, totalElements, pageNo, totalPages });
});

// ─── Get Single Category ────────────────────────────────
router.get('/:id', [auth], async (req, res) => {
  const category = await prisma.category.findUnique({
    where: { id: req.params.id },
  });
  if (!category) throw new AppError('Category not found.', 404);
  return success(res, category);
});

// ─── Create Category ────────────────────────────────────
router.post(
  '/',
  [auth, admin, upload.single('file'), validate(validateModel)],
  async (req, res) => {
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
  }
);

// ─── Update Category ────────────────────────────────────
router.put(
  '/:id',
  [auth, admin, upload.single('file'), validate(validateModel)],
  async (req, res) => {
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
  }
);

// ─── Delete Category ────────────────────────────────────
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    await prisma.category.delete({ where: { id: req.params.id } });
    return message(res, 'Category deleted successfully.');
  } catch (e) {
    throw new AppError('Category not found.', 404);
  }
});

module.exports = router;
