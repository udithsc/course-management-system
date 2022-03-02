const router = require('express').Router();
const moment = require('moment');
const multer = require('multer');
const randomstring = require('randomstring');
const fs = require('fs');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validate = require('../middleware/validate');
const { Category, validateModel } = require('../models/category.model');
const { Author } = require('../models/author.model');
const { Course } = require('../models/course.model');
const validateId = require('../middleware/validateId');
// const logger = require('../utils/logger');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '/app/data/uploads/courses');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
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
  res.send(course);
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

    const tokens = new Array(25).fill().map((v, i) => ({
      id: i + 1,
      token: randomstring.generate(5),
      user: null
    }));

    let course = new Course({
      name: req.body.name,
      category: {
        _id: category._id,
        name: category.name,
        icon: category.icon
      },
      author: {
        _id: author._id,
        name: author.name,
        profession: author.profession
      },
      description: req.body.description,
      fee: req.body.fee,
      tokens,
      image: req.file.filename
        ? `http://${req.headers.host}/files/courses/${req.file.filename}`
        : ''
    });

    course = await course.save();

    const dir = `/app/data/uploads/courses/${course._id}`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
      fs.mkdirSync(`${dir}/addons`);
      fs.mkdirSync(`${dir}/videos`);

      fs.renameSync(req.file.path, `${dir}/${req.file.filename}`);
    }

    res.send(course);
  }
);

router.put('/:id', [auth, admin, validate(validateModel)], async (req, res) => {
  const course = await Course.findByIdAndUpdate(
    req.params._id,
    {
      ...req.body,
      image: req.file.filename
        ? `http://${req.headers.host}/files/courses/${req.file.filename}`
        : req.body.image
    },
    {
      new: true
    }
  );
  if (!course)
    return res.status(404).send('The course with the given ID was not found.');

  res.send(course);
});

// RATINGS RELATED

//make upsert
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
  res.send(reviewData);
});

// VIDEO RELATED

router.get('/video/:id', [auth, validateId], async (req, res) => {
  const course = await Course.findById(req.params.id).select('lessons');
  if (!course)
    return res.status(404).send('The course with the given ID was not found.');
  res.send(course);
});

router.patch(
  '/video/:id',
  [auth, admin, validateId, upload.single('file')],
  async (req, res) => {
    const basePath = `/app/data/uploads/`;
    const fileName = `courses/${req.params.id}/videos/${req.file.filename}`;
    fs.renameSync(req.file.path, basePath + fileName);

    const result = await Course.updateOne(
      { _id: req.params.id },
      {
        $push: {
          lessons: {
            videoNo: req.body.videoNo,
            title: req.body.title,
            description: req.body.description,
            url: `http://${req.headers.host}/files/${fileName}`
          }
        }
      }
    );

    res.send(result);
  }
);

router.delete(
  '/video/:id/:videoNo',
  [auth, admin, validateId],
  async (req, res) => {
    const result = await Course.updateOne(
      { _id: req.params.id },
      {
        $pull: {
          lessons: {
            videoNo: req.params.videoNo
          }
        }
      },
      { safe: true, multi: true }
    );
    res.send(result);
  }
);

// ADDONS RELATED

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
  res.send(result);
});

router.get('/addons/:id', [auth, validateId], async (req, res) => {
  const course = await Course.findById(req.params.id).select('addons');
  if (!course)
    return res
      .status(404)
      .send('The course addons with the given ID was not found.');
  res.send(course);
});

router.patch(
  '/addons/:id',
  [auth, admin, validateId, upload.single('file')],
  async (req, res) => {
    const basePath = `/app/data/uploads/`;
    const fileName = `courses/${req.params.id}/addons/${req.file.filename}`;
    fs.renameSync(req.file.path, basePath + fileName);

    const result = await Course.updateOne(
      { _id: req.params.id },
      {
        $push: {
          addons: {
            id: Math.floor(Math.random() * 100) + Date.now(),
            title: req.body.title,
            description: req.body.description,
            date: moment().format('ll'),
            contents: [
              {
                id: Math.floor(Math.random() * 100) + Date.now(),
                image: `http://${req.headers.host}/files/${fileName}`
              }
            ]
          }
        }
      }
    );
    res.send(result);
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
    },
    { safe: true, multi: true }
  );

  res.send(result);
});

module.exports = router;
