const router = require('express').Router();
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const AppError = require('../utils/AppError');
const { success, created, paginated, message } = require('../utils/response');
const { validateModel } = require('../models/author.model');
const { createUpload, getFileUrl } = require('../utils/upload');
const prisma = require('../db');

const upload = createUpload('authors');

// List Authors (paginated)
router.get('/', [auth], async (req, res) => {
  const pageNo = parseInt(req.query.pageNo, 10) || 0;
  const pageSize = parseInt(req.query.pageSize, 10) || 10;
  const name = req.query.name || '';

  const where = {
    name: { contains: name, mode: 'insensitive' },
  };

  const totalElements = await prisma.author.count({ where });
  const totalPages = Math.ceil(totalElements / pageSize);

  const data = await prisma.author.findMany({
    where,
    skip: pageNo * pageSize,
    take: pageSize,
    orderBy: { name: 'asc' },
  });

  return paginated(res, { data, totalElements, pageNo, totalPages });
});

// Get Single Author
router.get('/:id', [auth], async (req, res) => {
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
  async (req, res) => {
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
  async (req, res) => {
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
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    await prisma.author.delete({ where: { id: req.params.id } });
    return message(res, 'Author deleted successfully.');
  } catch (e) {
    throw new AppError('Author not found.', 404);
  }
});

module.exports = router;
