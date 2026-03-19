const router = require('express').Router();
const moment = require('moment');
const randomstring = require('randomstring');
const fs = require('fs');
const { v4: uuid } = require('uuid');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validate = require('../middleware/validate');
const AppError = require('../utils/AppError');
const { success, created, paginated, message } = require('../utils/response');
const { validateModel } = require('../models/course.model');
const { createUpload, getFileUrl, appDir } = require('../utils/upload');
const prisma = require('../db');

const upload = createUpload('courses');

// ─── List Courses (paginated) ───────────────────────────
router.get('/', auth, async (req, res) => {
  const pageNo = parseInt(req.query.pageNo, 10) || 0;
  const pageSize = parseInt(req.query.pageSize, 10) || 100;
  const name = req.query.name || '';

  const where = {
    name: { contains: name, mode: 'insensitive' },
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
      lessons: true,
    },
    orderBy: { name: 'asc' },
  });

  return paginated(res, { data, totalElements, pageNo, totalPages });
});

// ─── Get Single Course ──────────────────────────────────
router.get('/:id', [auth], async (req, res) => {
  const course = await prisma.course.findUnique({
    where: { id: req.params.id },
    include: {
      author: true,
      category: true,
      reviews: true,
      lessons: true,
      addons: true,
    },
  });
  if (!course) throw new AppError('Course not found.', 404);
  return success(res, course);
});

// ─── Delete Course ──────────────────────────────────────
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    await prisma.course.delete({ where: { id: req.params.id } });
    return message(res, 'Course deleted successfully.');
  } catch (e) {
    throw new AppError('Course not found.', 404);
  }
});

// ─── Create Course ──────────────────────────────────────
router.post(
  '/',
  [auth, admin, upload.single('file'), validate(validateModel)],
  async (req, res) => {
    const category = await prisma.category.findUnique({
      where: { id: req.body.category },
    });
    if (!category) throw new AppError('Invalid category.', 400);

    const author = await prisma.author.findUnique({
      where: { id: req.body.author },
    });
    if (!author) throw new AppError('Invalid author.', 400);

    if (!req.file?.filename) {
      throw new AppError('Course image is required.', 400);
    }

    const tokens = new Array(25).fill(0).map((v, i) => ({
      tokenId: i + 1,
      token: randomstring.generate(5),
      userId: null,
    }));

    const { name, description, fee } = req.body;
    const course = await prisma.course.create({
      data: {
        name,
        description,
        fee: parseFloat(fee),
        categoryId: category.id,
        authorId: author.id,
        image: getFileUrl(req, 'courses', req.file.filename),
        courseTokens: { create: tokens },
      },
    });

    // Create directory structure for course assets
    const dir = `${appDir}/data/uploads/courses/${course.id}`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      fs.mkdirSync(`${dir}/addons`, { recursive: true });
      fs.mkdirSync(`${dir}/videos`, { recursive: true });
      fs.renameSync(req.file.path, `${dir}/${req.file.filename}`);
    }

    return created(res, course);
  }
);

// ─── Update Course ──────────────────────────────────────
router.put(
  '/:id',
  [auth, admin, upload.single('file'), validate(validateModel)],
  async (req, res) => {
    const category = await prisma.category.findUnique({
      where: { id: req.body.category },
    });
    if (!category) throw new AppError('Invalid category.', 400);

    const author = await prisma.author.findUnique({
      where: { id: req.body.author },
    });
    if (!author) throw new AppError('Invalid author.', 400);

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
            ? getFileUrl(req, 'courses', req.file.filename)
            : req.body.image,
        },
      });
      return success(res, course);
    } catch (e) {
      throw new AppError('Course not found.', 404);
    }
  }
);

// ─── Rate Course ────────────────────────────────────────
router.patch('/rate/:id', [auth], async (req, res) => {
  const { rating, comment } = req.body;
  if (!rating) throw new AppError('Rating is required.', 400);

  const result = await prisma.review.create({
    data: {
      courseId: req.params.id,
      userId: req.user.id,
      rating: parseInt(rating, 10),
      comment: comment || '',
      time: moment().format('ll'),
    },
  });

  return created(res, result);
});

// ─── Delete Rating ──────────────────────────────────────
router.delete('/rate/:id', [auth, admin], async (req, res) => {
  await prisma.review.deleteMany({
    where: {
      courseId: req.params.id,
      userId: req.user.id,
    },
  });
  return message(res, 'Review deleted.');
});

// ─── Get Course Reviews ─────────────────────────────────
router.get('/rate/:id', [auth], async (req, res) => {
  const course = await prisma.course.findUnique({
    where: { id: req.params.id },
    include: { reviews: true },
  });
  if (!course) throw new AppError('Course not found.', 404);

  const reviews = course.reviews;
  const userReview = reviews.find((r) => r.userId === req.user.id) || null;

  const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
  const avgRating = reviews.length ? totalRating / reviews.length : 0;

  return success(res, {
    userReview,
    reviews,
    reviewsCount: reviews.length,
    avgRating: Math.round(avgRating * 10) / 10,
  });
});

// ─── Get Course Videos ──────────────────────────────────
router.get('/video/:id', [auth], async (req, res) => {
  const course = await prisma.course.findUnique({
    where: { id: req.params.id },
    select: { lessons: true },
  });
  if (!course) throw new AppError('Course not found.', 404);
  return success(res, course);
});

// ─── Upload Video ───────────────────────────────────────
router.patch(
  '/video/:id',
  [auth, admin, upload.single('file')],
  async (req, res) => {
    if (!req.file) throw new AppError('Video file is required.', 400);

    const basePath = `${appDir}/data/uploads/courses/${req.params.id}/videos/`;
    const courseDir = `${appDir}/data/uploads/courses/${req.params.id}`;
    const videoDir = `${courseDir}/videos`;

    if (!fs.existsSync(courseDir)) fs.mkdirSync(courseDir, { recursive: true });
    if (!fs.existsSync(videoDir)) fs.mkdirSync(videoDir, { recursive: true });

    fs.renameSync(req.file.path, basePath + req.file.filename);

    const result = await prisma.lesson.create({
      data: {
        courseId: req.params.id,
        title: req.body.title || '',
        description: req.body.description || '',
        url: getFileUrl(req, `courses/${req.params.id}/videos`, req.file.filename),
      },
    });

    return created(res, result);
  }
);

// ─── Delete Video ───────────────────────────────────────
router.delete('/video/:id/:videoId', [auth, admin], async (req, res) => {
  await prisma.lesson.deleteMany({
    where: {
      id: req.params.videoId,
      courseId: req.params.id,
    },
  });
  return message(res, 'Video deleted.');
});

// ─── Activate Course (Token) ────────────────────────────
router.patch('/activateCourse', [auth], async (req, res) => {
  const { course, token } = req.body;
  if (!course || !token) throw new AppError('Course ID and token are required.', 400);

  const tokenRecord = await prisma.courseToken.findFirst({
    where: { courseId: course, token },
  });
  if (!tokenRecord) throw new AppError('Invalid course or token.', 404);

  const result = await prisma.courseToken.update({
    where: { id: tokenRecord.id },
    data: { userId: req.user.id },
  });

  return success(res, result);
});

// ─── Get Course Addons ──────────────────────────────────
router.get('/addons/:id', [auth], async (req, res) => {
  const course = await prisma.course.findUnique({
    where: { id: req.params.id },
    include: { addons: true },
  });
  if (!course) throw new AppError('Course not found.', 404);
  return success(res, course.addons);
});

// ─── Upload Addon ───────────────────────────────────────
router.patch(
  '/addons/:id',
  [auth, admin, upload.single('file')],
  async (req, res) => {
    if (!req.file) throw new AppError('Addon file is required.', 400);

    const courseDir = `${appDir}/data/uploads/courses/${req.params.id}`;
    const addonDir = `${courseDir}/addons`;

    if (!fs.existsSync(courseDir)) fs.mkdirSync(courseDir, { recursive: true });
    if (!fs.existsSync(addonDir)) fs.mkdirSync(addonDir, { recursive: true });

    fs.renameSync(req.file.path, `${addonDir}/${req.file.filename}`);

    const result = await prisma.addon.create({
      data: {
        courseId: req.params.id,
        title: req.body.title || '',
        description: req.body.description || '',
        date: moment().format('ll'),
        contents: [
          {
            id: uuid(),
            image: getFileUrl(req, `courses/${req.params.id}/addons`, req.file.filename),
          },
        ],
      },
    });

    return created(res, result);
  }
);

// ─── Delete Addon ───────────────────────────────────────
router.delete('/addons/:courseId/:addonId', [auth, admin], async (req, res) => {
  await prisma.addon.deleteMany({
    where: {
      id: req.params.addonId,
      courseId: req.params.courseId,
    },
  });
  return message(res, 'Addon deleted.');
});

module.exports = router;
