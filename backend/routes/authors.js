const router = require('express').Router();
const multer = require('multer');
const fs = require('fs');
const { dirname } = require('path');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { validateModel } = require('../models/author.model');
const appDir = dirname(require.main.filename);
const prisma = require('../db');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = `/${appDir}/data/uploads/authors`;
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
  const pageSize = parseInt(req.query.pageSize, 10) || 10;
  const name = req.query.name || '';

  const where = {
    name: {
      contains: name,
      mode: 'insensitive'
    }
  };

  const totalElements = await prisma.author.count({ where });
  const totalPages = Math.ceil(totalElements / pageSize);

  const data = await prisma.author.findMany({
    where,
    skip: pageNo * pageSize,
    take: pageSize,
    orderBy: { name: 'asc' }
  });

  res.send({ totalElements, pageNo, totalPages, data });
});

router.get('/:id', [auth], async (req, res) => {
  const author = await prisma.author.findUnique({ where: { id: req.params.id } });
  if (!author)
    return res.status(404).send('The author with the given ID was not found.');
  return res.send(author);
});

router.post(
  '/',
  [auth, admin, upload.single('file'), validate(validateModel)],
  async (req, res) => {
    const { name, profession, email, mobile } = req.body;
    let author = await prisma.author.create({
      data: {
        name,
        profession,
        email: email || null,
        mobile: mobile ? mobile.toString() : null,
        image: req.file?.filename
          ? `http://${req.headers.host}/files/authors/${req.file.filename}`
          : null
      }
    });
    res.send(author);
  }
);

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
          image: req.file?.filename
            ? `http://${req.headers.host}/files/authors/${req.file.filename}`
            : req.body.file
        }
      });
      return res.send(author);
    } catch (e) {
      return res.status(404).send('The author with the given ID was not found.');
    }
  }
);

router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const result = await prisma.author.delete({ where: { id: req.params.id } });
    res.send(result);
  } catch (e) {
    res.status(404).send('Author not found');
  }
});

module.exports = router;
