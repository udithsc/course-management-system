const router = require('express').Router();
const moment = require('moment');
const multer = require('multer');
const randomstring = require('randomstring');
const fs = require('fs');
const { v4: uuid } = require('uuid');
const { dirname } = require('path');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validate = require('../middleware/validate');
const { Category } = require('../models/category.model');
const { Author } = require('../models/author.model');
const { Course, validateModel } = require('../models/course.model');
const validateId = require('../middleware/validateId');
const appDir = dirname(require.main.filename);
// const logger = require('../utils/logger');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = `/${appDir}/data/uploads/courses`;
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

router.get('/', auth, async (req, res) => {
  const selections = req.user?.isAdmin ? '-__v' : '-__v -tokens -addons';
  const pageNo = parseInt(req.query.pageNo, 10) || 0;
  const pageSize = parseInt(req.query.pageSize, 10) || 100;
  let totalElements = await Course.estimatedDocumentCount();
  const totalPages = Math.ceil(totalElements / pageSize);
  const name = req.query.name || '';

  const data = await Course.find({
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
  const selections = req.user?.isAdmin ? '-__v' : '-__v -addons';
  const course = await Course.findById(req.params.id).select(selections);
  if (!course)
    return res.status(404).send('The course with the given ID was not found.');
  return res.send(course);
});

router.delete('/:id', [auth, admin, validateId], async (req, res) => {
  const result = await Course.deleteOne({ _id: req.params.id });
  res.send(result);
});

router.post(
  '/',
  [auth, admin, upload.single('file'), validate(validateModel)],
  async (req, res) => {
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send('Invalid category.');

    const author = await Author.findById(req.body.author);
    if (!author) return res.status(400).send('Invalid author.');

    if (req.file?.filename)
      return res.status(400).send('Course image is required.');

    const tokens = new Array(25).fill().map((v, i) => ({
      id: i + 1,
      token: randomstring.generate(5),
      user: null
    }));

    const { name, description, fee } = req.body;
    let course = new Course({
      name,
      description,
      fee,
      category,
      author,
      tokens,
      image: req.file?.filename
        ? `http://${req.headers.host}/files/courses/${req.file.filename}`
        : ''
    });

    course = await course.save();

    const dir = `/${appDir}/data/uploads/courses/${course._id}`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
      fs.mkdirSync(`${dir}/addons`);
      fs.mkdirSync(`${dir}/videos`);

      fs.renameSync(req.file.path, `${dir}/${req.file.filename}`);
    }

    return res.send(course);
  }
);

// router.put('/:id', [auth, admin, validate(validateModel)], async (req, res) => {
router.put('/:id', [auth, admin, upload.single('file')], async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send('Invalid category.');

  const author = await Author.findById(req.body.author);
  if (!author) return res.status(400).send('Invalid author.');

  const { name, description, fee } = req.body;
  const course = await Course.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      fee,
      category,
      author,
      image: req.file?.filename
        ? `http://${req.headers.host}/files/courses/${req.file.filename}`
        : req.body.image
    },
    {
      new: true
    }
  );
  if (!course)
    return res.status(404).send('The course with the given ID was not found.');

  return res.send(course);
});

// -----------------------RATINGS RELATED-----------------------------

// make upsert
router.patch('/rate/:id', [auth, validateId], async (req, res) => {
  const result = await Course.updateOne(
    { _id: req.params.id, 'reviews.id': req.user.id },
    {
      $push: {
        reviews: {
          id: req.user.id,
          name: req.user.firstName + req.user.lastName,
          rating: req.body.rating,
          comment: req.body.comment,
          time: moment().format('ll')
        }
      }
    }
  );
  res.send(result);
});

router.delete('/rate/:id', [auth, admin, validateId], async (req, res) => {
  const result = await Course.updateOne(
    { _id: req.params.id },
    {
      $pull: {
        reviews: { user: req.user.id }
      }
    },
    { safe: true, multi: true }
  );
  res.send(result);
});

router.get('/rate/:id', [auth, validateId], async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course)
    return res.status(404).send('The course with the given ID was not found.');

  const { reviews } = course;
  const course_reviews = reviews.filter((review) => review.rating !== 'null');
  const reviewData = {};
  const userReview = course_reviews.find(
    (review) => review.user === req.user.id
  );
  reviewData.userReview = !userReview ? null : userReview;
  reviewData.reviews = course_reviews;
  reviewData.reviewsCount = course_reviews.length;

  let totalRating = 0;
  course_reviews.forEach((review) => {
    totalRating += review.rating;
  });
  reviewData.avgRating = totalRating / course_reviews.length;
  return res.send(reviewData);
});

// ------------------------VIDEO RELATED--------------------------

router.get('/video/:id', [auth, validateId], async (req, res) => {
  const course = await Course.findById(req.params.id).select('lessons');
  if (!course)
    return res.status(404).send('The course with the given ID was not found.');
  return res.send(course);
});

router.patch(
  '/video/:id',
  [auth, admin, validateId, upload.single('file')],
  async (req, res) => {
    const basePath = `${appDir}/data/uploads/courses/${req.params.id}/videos/`;
    const courseDir = `${appDir}/data/uploads/courses/${req.params.id}`;
    const videoDir = `${appDir}/data/uploads/courses/${req.params.id}/videos`;

    if (!fs.existsSync(courseDir)) fs.mkdirSync(courseDir);
    if (!fs.existsSync(videoDir)) fs.mkdirSync(videoDir);

    fs.renameSync(req.file.path, basePath + req.file.filename);

    const result = await Course.updateOne(
      { _id: req.params.id },
      {
        $push: {
          lessons: {
            id: uuid(),
            title: req.body.title,
            description: req.body.description,
            url: `http://${req.headers.host}/files/courses/${req.params.id}/videos/${req.file.filename}`
          }
        }
      }
    );

    res.send(result);
  }
);

router.delete(
  '/video/:id/:videoId',
  [auth, admin, validateId],
  async (req, res) => {
    const result = await Course.updateOne(
      { _id: req.params.id },
      {
        $pull: {
          lessons: {
            id: req.params.videoId
          }
        }
      },
      { safe: true, multi: true }
    );
    res.send(result);
  }
);

// -------------- ADDONS RELATED -----------------------

router.patch('/activateCourse', [auth], async (req, res) => {
  const result = await Course.findByIdAndUpdate(
    { _id: req.body.course, 'tokens.token': req.body.token },
    {
      $set: {
        'tokens.$.user': req.user.id
      }
    }
  );
  if (!result) return res.status(404).send('Course or token is invalid.');
  return res.send(result);
});

router.get('/addons/:id', [auth, validateId], async (req, res) => {
  const course = await Course.findById(req.params.id).select('addons');
  if (!course)
    return res
      .status(404)
      .send('The course addons with the given ID was not found.');
  return res.send(course);
});

router.patch(
  '/addons/:id',
  [auth, admin, validateId, upload.single('file')],
  async (req, res) => {
    const basePath = `${appDir}/data/uploads/courses/${req.params.id}/addons/`;
    const courseDir = `${appDir}/data/uploads/courses/${req.params.id}`;
    const addonDir = `${appDir}/data/uploads/courses/${req.params.id}/addons`;

    if (!fs.existsSync(courseDir)) fs.mkdirSync(courseDir);
    if (!fs.existsSync(addonDir)) fs.mkdirSync(addonDir);
    fs.renameSync(req.file.path, basePath + req.file.filename);

    const result = await Course.updateOne(
      { _id: req.params.id },
      {
        $push: {
          addons: {
            id: uuid(),
            title: req.body.title,
            description: req.body.description,
            date: moment().format('ll'),
            contents: [
              {
                id: uuid(),
                image: `http://${req.headers.host}/files/courses/${req.params.id}/addons/${req.file.filename}`
              }
            ]
          }
        }
      }
    );
    return res.send(result);
  }
);

router.delete('/addons/:courseId/:addonId', [auth, admin], async (req, res) => {
  const result = await Course.updateOne(
    { _id: req.params.courseId },
    {
      $pull: {
        addons: {
          id: req.params.addonId
        }
      }
    }
  );

  return res.send(result);
});

module.exports = router;
