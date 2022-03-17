const router = require('express').Router();
const multer = require('multer');
const { dirname } = require('path');
const fs = require('fs');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { User, validateModel } = require('../models/user.model');
const { Course } = require('../models/course.model');
const { Category } = require('../models/category.model');
const validateId = require('../middleware/validateId');
const appDir = dirname(require.main.filename);
// const logger = require('../utils/logger');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = `/${appDir}/data/uploads/users`;
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

router.get('/', [auth], async (req, res) => {
  const selections = req.user?.isAdmin ? '-__v -password' : '-__v -password';

  const pageNo = parseInt(req.query.pageNo, 10) || 0;
  const pageSize = parseInt(req.query.pageSize, 10) || 10;
  const totalElements = await User.estimatedDocumentCount();
  const totalPages = Math.ceil(totalElements / pageSize);
  const name = req.query.name || '';

  const data = await User.find({
    firstName: {
      $regex: name,
      $options: 'i'
    }
  })
    .skip(pageNo * pageSize)
    .limit(pageSize)
    .select(selections)
    .sort('name');

  res.send({ totalElements, pageNo, totalPages, data });
});

router.post('/', [auth, admin, validate(validateModel)], async (req, res) => {
  let user = new User({
    ...req.body
  });
  user = await user.save();
  res.send(user);
});

router.put('/:id', [auth, admin, validate(validateModel)], async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params._id, req.body, {
    new: true
  });
  if (!user) return res.status(404).send('The user not found.');

  res.send(user);
});

router.delete('/:id', [auth, admin, validateId], async (req, res) => {
  const result = await User.deleteOne({ _id: req.params.id });
  res.send(result);
});

router.get('/me', [auth], async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
});

router.delete('/closeAccount', [auth], async (req, res) => {
  const result = await User.deleteOne({ _id: req.user.id });
  res.send(result);
});

router.get('/dashboard', [auth], async (req, res) => {
  const user = await User.findById(req.user.id).select('-__v');
  const courses = await Course.find().select('-__v -tokens -addons');
  const categories = await Category.find().select('_id', 'name');

  const subscriptions = user.subscriptions.map((course) => {
    const subCourse = courses.find((o) => o._id === course.courseId);
    const subCategory = categories.find((o) => o._id === subCourse.category);
    const precentage =
      (course.watchedVideoId.length / subCourse.lessons.length) * 100;

    return {
      _id: course.courseId,
      name: subCourse.name,
      precentage: Math.round(precentage),
      category: subCategory.name
    };
  });

  res.json({
    user,
    subscriptions,
    courses,
    categories,
    developerPicks: courses
  });
});

router.post('/subscribe', [auth, validateId], async (req, res) => {
  const result = await User.updateOne(
    { _id: req.user.id, 'subscriptions.courseId': { $ne: req.body.id } },
    {
      $push: {
        subscriptions: {
          courseId: req.body.course,
          watchedVideoId: []
        }
      }
    }
  );

  const result2 = await Course.updateOne(
    { _id: req.body.id },
    { $inc: { subscriptions: 1 } }
  );
  res.send(result);
});

router.post('/unsubscribe', [auth, validateId], async (req, res) => {
  const result = await User.updateOne(
    { _id: req.user.id },
    { $pull: { subscriptions: { courseId: req.body.id } } },
    { safe: true, multi: true }
  );

  const result2 = await Course.updateOne(
    { _id: req.body.id },
    { $inc: { subscriptions: -1 } }
  );
  res.send(result);
});

router.post('/bookmark', [auth, validateId], async (req, res) => {
  const result = await User.updateOne(
    { _id: req.user.id, 'bookmarks.courseId': { $ne: req.body.id } },
    {
      $push: {
        bookmarks: req.body.id
      }
    }
  );
  res.send(result);
});

router.delete('/bookmark/:id', [auth, validateId], async (req, res) => {
  const result = await User.updateOne(
    { _id: req.user.id },
    { $pull: { bookmarks: req.params.id } },
    { safe: true, multi: true }
  );
  res.send(result);
});

router.post('/watch', [auth, validateId], async (req, res) => {
  const result = await User.updateOne(
    { _id: req.user.id, 'subscriptions.courseId': req.body.id },
    {
      $push: {
        'subscriptions.$.watchedVideoId': req.body.video
      }
    }
  );
  res.send(result);
});

router.post('/image', [auth, upload.single('file')], async (req, res) => {
  const result = await User.updateOne(
    { _id: req.user.id },
    {
      image: req.file.filename
        ? `http://${req.headers.host}/files/categories/${req.file.filename}`
        : null
    }
  );
  res.send(result);
});

router.delete('/image', [auth], async (req, res) => {
  const result = await User.updateOne({ _id: req.user.id }, { image: '' });
  res.send(result);
});

module.exports = router;
