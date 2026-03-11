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
const { validateModel } = require('../models/course.model');
const appDir = dirname(require.main.filename);
const prisma = require('../db');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = `/${appDir}/data/uploads/courses`;
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

router.get('/', auth, async (req, res) => {
  const pageNo = parseInt(req.query.pageNo, 10) || 0;
  const pageSize = parseInt(req.query.pageSize, 10) || 100;
  const name = req.query.name || '';

  const where = {
    name: {
      contains: name,
      mode: 'insensitive'
    }
  };

  const totalElements = await prisma.course.count({ where });
  const totalPages = Math.ceil(totalElements / pageSize);

  const data = await prisma.course.findMany({
    where,
    skip: pageNo * pageSize,
    take: pageSize,
    include: {
      author: true,
      category: true,
      reviews: true,
      lessons: true
    },
    orderBy: { name: 'asc' }
  });

  res.send({ totalElements, pageNo, totalPages, data });
});

router.get('/:id', [auth], async (req, res) => {
  const course = await prisma.course.findUnique({
    where: { id: req.params.id },
    include: {
      author: true,
      category: true,
      reviews: true,
      lessons: true,
      addons: true
    }
  });
  if (!course)
    return res.status(404).send('The course with the given ID was not found.');
  return res.send(course);
});

router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const result = await prisma.course.delete({ where: { id: req.params.id } });
    res.send(result);
  } catch (e) {
    res.status(400).send('Error deleting course');
  }
});

router.post(
  '/',
  [auth, admin, upload.single('file'), validate(validateModel)],
  async (req, res) => {
    const category = await prisma.category.findUnique({ where: { id: req.body.category } });
    if (!category) return res.status(400).send('Invalid category.');

    const author = await prisma.author.findUnique({ where: { id: req.body.author } });
    if (!author) return res.status(400).send('Invalid author.');

    if (!req.file?.filename)
      return res.status(400).send('Course image is required.');

    const tokens = new Array(25).fill(0).map((v, i) => ({
      tokenId: i + 1,
      token: randomstring.generate(5),
      userId: null
    }));

    const { name, description, fee } = req.body;
    let course = await prisma.course.create({
      data: {
        name,
        description,
        fee: parseFloat(fee),
        categoryId: category.id,
        authorId: author.id,
        image: `http://${req.headers.host}/files/courses/${req.file.filename}`,
        courseTokens: { create: tokens }
      }
    });

    const dir = `/${appDir}/data/uploads/courses/${course.id}`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      fs.mkdirSync(`${dir}/addons`, { recursive: true });
      fs.mkdirSync(`${dir}/videos`, { recursive: true });
      fs.renameSync(req.file.path, `${dir}/${req.file.filename}`);
    }

    return res.send(course);
  }
);

router.put('/:id', [auth, admin, upload.single('file'), validate(validateModel)], async (req, res) => {
  const category = await prisma.category.findUnique({ where: { id: req.body.category } });
  if (!category) return res.status(400).send('Invalid category.');

  const author = await prisma.author.findUnique({ where: { id: req.body.author } });
  if (!author) return res.status(400).send('Invalid author.');

  const { name, description, fee } = req.body;
  
  try {
    const course = await prisma.course.update({
      where: { id: req.params.id },
      data: {
        name,
        description,
        fee: parseFloat(fee),
        categoryId: category.id,
        authorId: author.id,
        image: req.file?.filename
          ? `http://${req.headers.host}/files/courses/${req.file.filename}`
          : req.body.image
      }
    });
    return res.send(course);
  } catch (e) {
    return res.status(404).send('The course with the given ID was not found.');
  }
});

router.patch('/rate/:id', [auth], async (req, res) => {
  const userId = req.user.id;
  const user = await prisma.user.findUnique({ where: { id: userId } });

  const result = await prisma.review.create({
    data: {
      courseId: req.params.id,
      userId: userId,
      rating: parseInt(req.body.rating),
      comment: req.body.comment,
      time: moment().format('ll')
    }
  });

  res.send(result);
});

router.delete('/rate/:id', [auth, admin], async (req, res) => {
  const userId = req.user.id;
  await prisma.review.deleteMany({
    where: {
      courseId: req.params.id,
      userId: userId
    }
  });
  res.send({ success: true });
});

router.get('/rate/:id', [auth], async (req, res) => {
  const course = await prisma.course.findUnique({
    where: { id: req.params.id },
    include: { reviews: true }
  });
  
  if (!course)
    return res.status(404).send('The course with the given ID was not found.');

  const userId = req.user.id;
  const course_reviews = course.reviews;
  
  const userReview = course_reviews.find((review) => review.userId === userId);
  const reviewData = {};
  reviewData.userReview = !userReview ? null : userReview;
  reviewData.reviews = course_reviews;
  reviewData.reviewsCount = course_reviews.length;

  let totalRating = 0;
  course_reviews.forEach((review) => {
    totalRating += review.rating;
  });
  
  reviewData.avgRating = course_reviews.length ? totalRating / course_reviews.length : 0;
  return res.send(reviewData);
});

router.get('/video/:id', [auth], async (req, res) => {
  const course = await prisma.course.findUnique({
    where: { id: req.params.id },
    select: { lessons: true }
  });
  if (!course)
    return res.status(404).send('The course with the given ID was not found.');
  return res.send(course);
});

router.patch(
  '/video/:id',
  [auth, admin, upload.single('file')],
  async (req, res) => {
    const basePath = `${appDir}/data/uploads/courses/${req.params.id}/videos/`;
    const courseDir = `${appDir}/data/uploads/courses/${req.params.id}`;
    const videoDir = `${appDir}/data/uploads/courses/${req.params.id}/videos`;

    if (!fs.existsSync(courseDir)) fs.mkdirSync(courseDir, { recursive: true });
    if (!fs.existsSync(videoDir)) fs.mkdirSync(videoDir, { recursive: true });

    fs.renameSync(req.file.path, basePath + req.file.filename);

    const result = await prisma.lesson.create({
      data: {
        courseId: req.params.id,
        title: req.body.title,
        description: req.body.description,
        url: `http://${req.headers.host}/files/courses/${req.params.id}/videos/${req.file.filename}`
      }
    });

    res.send(result);
  }
);

router.delete(
  '/video/:id/:videoId',
  [auth, admin],
  async (req, res) => {
    const result = await prisma.lesson.deleteMany({
      where: {
        id: req.params.videoId,
        courseId: req.params.id
      }
    });
    res.send(result);
  }
);

router.patch('/activateCourse', [auth], async (req, res) => {
  const userId = req.user.id;
  const tokenRecord = await prisma.courseToken.findFirst({
    where: {
      courseId: req.body.course,
      token: req.body.token
    }
  });

  if (!tokenRecord) return res.status(404).send('Course or token is invalid.');

  const result = await prisma.courseToken.update({
    where: { id: tokenRecord.id },
    data: { userId }
  });

  return res.send(result);
});

router.get('/addons/:id', [auth], async (req, res) => {
  const course = await prisma.course.findUnique({
    where: { id: req.params.id },
    include: { addons: true }
  });
  if (!course)
    return res.status(404).send('The course addons with the given ID was not found.');
  return res.send(course.addons);
});

router.patch(
  '/addons/:id',
  [auth, admin, upload.single('file')],
  async (req, res) => {
    const basePath = `${appDir}/data/uploads/courses/${req.params.id}/addons/`;
    const courseDir = `${appDir}/data/uploads/courses/${req.params.id}`;
    const addonDir = `${appDir}/data/uploads/courses/${req.params.id}/addons`;

    if (!fs.existsSync(courseDir)) fs.mkdirSync(courseDir, { recursive: true });
    if (!fs.existsSync(addonDir)) fs.mkdirSync(addonDir, { recursive: true });
    fs.renameSync(req.file.path, basePath + req.file.filename);

    const result = await prisma.addon.create({
      data: {
        courseId: req.params.id,
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
    });
    
    return res.send(result);
  }
);

router.delete('/addons/:courseId/:addonId', [auth, admin], async (req, res) => {
  const result = await prisma.addon.deleteMany({
    where: {
      id: req.params.addonId,
      courseId: req.params.courseId
    }
  });

  return res.send(result);
});

module.exports = router;
