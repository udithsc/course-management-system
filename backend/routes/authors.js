const router = require('express').Router();
const multer = require('multer');
const { dirname } = require('path');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { Author, validateModel } = require('../models/author.model');
const validateId = require('../middleware/validateId');
const appDir = dirname(require.main.filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `/${appDir}/data/uploads/authors`);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

router.get('/', [auth], async (req, res) => {
  const pageNo = parseInt(req.query.pageNo, 10) || 0;
  const pageSize = parseInt(req.query.pageSize, 10) || 10;
  const totalElements = await Author.estimatedDocumentCount();
  const totalPages = Math.ceil(totalElements / pageSize);
  const name = req.query.name || '';

  const data = await Author.find({
    name: {
      $regex: name,
      $options: 'i'
    }
  })
    .skip(pageNo * pageSize)
    .limit(pageSize)
    .select('-__v')
    .sort('name');

  res.send({ totalElements, pageNo, totalPages, data });
});

router.get('/:id', [auth, validateId], async (req, res) => {
  const author = await Author.findById(req.params.id).select('-__v');
  if (!author)
    return res.status(404).send('The author with the given ID was not found.');
  res.send(author);
});

router.post(
  '/',
  [auth, admin, upload.single('file'), validate(validateModel)],
  async (req, res) => {
    let author = new Author({
      ...req.body,
      image: req.file.filename
        ? `http://${req.headers.host}/files/authors/${req.file.filename}`
        : null
    });
    author = await author.save();
    res.send(author);
  }
);

router.put(
  '/:id',
  [auth, admin, validateId, upload.single('file'), validate(validateModel)],
  async (req, res) => {
    const author = await Author.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        image: req.file?.filename
          ? `http://${req.headers.host}/files/authors/${req.file.filename}`
          : req.body.file
      },
      {
        new: true
      }
    );

    if (!author)
      return res
        .status(404)
        .send('The author with the given ID was not found.');
    res.send(author);
  }
);

router.delete('/:id', [auth, admin, validateId], async (req, res) => {
  const result = await Author.deleteOne({ _id: req.params.id });
  res.send(result);
});

module.exports = router;
