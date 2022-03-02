const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { Category, validateModel } = require('../models/category.model');
const router = require('express').Router();
const multer = require('multer');
const fs = require('fs');

const validateId = require('../middleware/validateId');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = `/app/data/uploads/categories`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

router.get('/', [auth], async (req, res) => {
  const selections = req.user?.isAdmin ? '-__v' : '-__v -tokens -addons';

  const pageNo = parseInt(req.query.pageNo, 10) || 0;
  const pageSize = parseInt(req.query.pageSize, 10) || 100;
  let totalElements = await Category.estimatedDocumentCount();
  const totalPages = Math.ceil(totalElements / pageSize);
  const name = req.query.name || '';

  const data = await Category.find({
    name: {
      $regex: name,
      $options: 'i'
    }
  })
    .skip(pageNo * pageSize)
    .limit(pageSize)
    .select(selections)
    .sort('name');

  if (name) totalElements = data.length;

  res.send({ totalElements, pageNo, totalPages, data });
});

router.get('/:id', [auth, validateId], async (req, res) => {
  const category = await Category.findById(req.params.id).select('-__v');
  if (!category)
    return res
      .status(404)
      .send('The category with the given ID was not found.');
  res.send(category);
});

router.post(
  '/',
  [auth, admin, upload.single('file'), validate(validateModel)],
  async (req, res) => {
    let category = new Category({
      ...req.body,
      icon: req.file.filename
        ? `http://${req.headers.host}/files/categories/${req.file.filename}`
        : null
    });
    category = await category.save();
    res.send(category);
  }
);

router.put(
  '/:id',
  [auth, admin, upload.single('file'), validate(validateModel)],
  async (req, res) => {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        icon: req.file?.filename
          ? `http://${req.headers.host}/files/categories/${req.file.filename}`
          : req.body.file
      },
      {
        new: true
      }
    );

    if (!category)
      return res
        .status(404)
        .send('The category with the given ID was not found.');
    res.send(category);
  }
);

router.delete('/:id', [auth, admin, validateId], async (req, res) => {
  const result = await Category.deleteOne({ _id: req.params.id });
  res.send(result);
});

module.exports = router;
