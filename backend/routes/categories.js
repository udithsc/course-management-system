const router = require('express').Router();
const multer = require('multer');
const fs = require('fs');
const { dirname } = require('path');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { validateModel } = require('../models/category.model');
const appDir = dirname(require.main.filename);
const prisma = require('../db');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = `/${appDir}/data/uploads/categories`;
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

router.get('/', [auth], async (req, res) => {
  const pageNo = parseInt(req.query.pageNo, 10) || 0;
  const pageSize = parseInt(req.query.pageSize, 10) || 100;
  const name = req.query.name || '';

  const where = {
    name: {
      contains: name,
      mode: 'insensitive'
    }
  };

  const totalElements = await prisma.category.count({ where });
  const totalPages = Math.ceil(totalElements / pageSize);

  const data = await prisma.category.findMany({
    where,
    skip: pageNo * pageSize,
    take: pageSize,
    orderBy: { name: 'asc' }
  });

  res.send({ totalElements, pageNo, totalPages, data });
});

router.get('/:id', [auth], async (req, res) => {
  const category = await prisma.category.findUnique({ where: { id: req.params.id } });
  if (!category)
    return res.status(404).send('The category with the given ID was not found.');
  return res.send(category);
});

router.post(
  '/',
  [auth, admin, upload.single('file'), validate(validateModel)],
  async (req, res) => {
    const { name } = req.body;
    let category = await prisma.category.create({
      data: {
        name,
        icon: req.file?.filename
          ? `http://${req.headers.host}/files/categories/${req.file.filename}`
          : req.body.file || ''
      }
    });
    res.send(category);
  }
);

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
            ? `http://${req.headers.host}/files/categories/${req.file.filename}`
            : req.body.file
        }
      });
      return res.send(category);
    } catch (e) {
      return res.status(404).send('The category with the given ID was not found.');
    }
  }
);

router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const result = await prisma.category.delete({ where: { id: req.params.id } });
    res.send(result);
  } catch (e) {
    res.status(404).send('Category not found');
  }
});

module.exports = router;
