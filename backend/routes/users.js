const router = require('express').Router();
const multer = require('multer');
const { dirname } = require('path');
const fs = require('fs');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { validateModel } = require('../models/user.model');
const appDir = dirname(require.main.filename);
const prisma = require('../db');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = `/${appDir}/data/uploads/users`;
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
    firstName: {
      contains: name,
      mode: 'insensitive'
    }
  };

  const totalElements = await prisma.user.count({ where });
  const totalPages = Math.ceil(totalElements / pageSize);

  const data = await prisma.user.findMany({
    where,
    skip: pageNo * pageSize,
    take: pageSize,
    orderBy: { firstName: 'asc' },
    select: {
      id: true,
      username: true,
      email: true,
      firstName: true,
      lastName: true,
      mobile: true,
      dob: true,
      image: true,
      bookmarks: true,
      isVerified: true,
      isAdmin: true,
      createdAt: true,
      updatedAt: true
    }
  });

  res.send({ totalElements, pageNo, totalPages, data });
});

router.post('/', [auth, admin, validate(validateModel)], async (req, res) => {
  const { username, email, firstName, lastName, mobile } = req.body;
  const user = await prisma.user.create({
    data: {
      username,
      email,
      firstName,
      lastName,
      mobile: mobile ? mobile.toString() : ''
    }
  });
  res.send(user);
});

router.put('/:id', [auth, admin, validate(validateModel)], async (req, res) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.params.id || req.params.id },
      data: req.body
    });
    res.send(user);
  } catch (e) {
    return res.status(404).send('The user not found.');
  }
});

router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const result = await prisma.user.delete({ where: { id: req.params.id } });
    res.send(result);
  } catch (e) {
    res.status(404).send('User not found');
  }
});

router.get('/me', [auth], async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      username: true,
      email: true,
      firstName: true,
      lastName: true,
      mobile: true,
      dob: true,
      image: true,
      bookmarks: true,
      isVerified: true,
      isAdmin: true,
      subscriptions: true
    }
  });
  res.send(user);
});

router.delete('/closeAccount', [auth], async (req, res) => {
  try {
    const result = await prisma.user.delete({ where: { id: req.user.id } });
    res.send(result);
  } catch (e) {
    res.status(400).send('Error');
  }
});

router.get('/dashboard', [auth], async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: { subscriptions: true }
  });
  
  const courses = await prisma.course.findMany({
    include: { lessons: true }
  });
  const categories = await prisma.category.findMany({
    select: { id: true, name: true }
  });

  const subscriptions = user.subscriptions.map((sub) => {
    const subCourse = courses.find((o) => o.id === sub.courseId);
    if(!subCourse) return null;
    const subCategory = categories.find((o) => o.id === subCourse.categoryId);
    const precentage = subCourse.lessons.length > 0
      ? (sub.watchedVideoId.length / subCourse.lessons.length) * 100
      : 0;

    return {
      id: sub.courseId,
      name: subCourse.name,
      precentage: Math.round(precentage),
      category: subCategory?.name
    };
  }).filter(Boolean);

  res.json({
    user,
    subscriptions,
    courses,
    categories,
    developerPicks: courses
  });
});

router.post('/subscribe', [auth], async (req, res) => {
  const existingSub = await prisma.subscription.findFirst({
    where: { userId: req.user.id, courseId: req.body.course || req.body.id }
  });

  if (!existingSub) {
    await prisma.subscription.create({
      data: {
        userId: req.user.id,
        courseId: req.body.course || req.body.id
      }
    });

    await prisma.course.update({
      where: { id: req.body.id || req.body.course },
      data: { subscriptions: { increment: 1 } }
    });
  }

  res.send('Success');
});

router.post('/unsubscribe', [auth], async (req, res) => {
  const existingSub = await prisma.subscription.findFirst({
    where: { userId: req.user.id, courseId: req.body.id }
  });

  if (existingSub) {
    await prisma.subscription.delete({ where: { id: existingSub.id } });
    await prisma.course.update({
      where: { id: req.body.id },
      data: { subscriptions: { decrement: 1 } }
    });
  }

  res.send('Success');
});

router.post('/bookmark', [auth], async (req, res) => {
  const userId = req.user.id;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  
  if (user && !user.bookmarks.includes(req.body.id)) {
    await prisma.user.update({
      where: { id: userId },
      data: { bookmarks: { push: req.body.id } }
    });
  }
  res.send('Success');
});

router.delete('/bookmark/:id', [auth], async (req, res) => {
  const userId = req.user.id;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  
  if (user) {
    await prisma.user.update({
      where: { id: userId },
      data: { bookmarks: user.bookmarks.filter(b => b !== req.params.id) }
    });
  }
  res.send('Success');
});

router.post('/watch', [auth], async (req, res) => {
  const userId = req.user.id;
  const sub = await prisma.subscription.findFirst({
    where: { userId, courseId: req.body.id }
  });
  
  if (sub && !sub.watchedVideoId.includes(req.body.video)) {
    await prisma.subscription.update({
      where: { id: sub.id },
      data: { watchedVideoId: { push: req.body.video } }
    });
  }
  res.send('Success');
});

router.post('/image', [auth, upload.single('file')], async (req, res) => {
  const result = await prisma.user.update({
    where: { id: req.user.id },
    data: {
      image: req.file?.filename
        ? `http://${req.headers.host}/files/categories/${req.file.filename}`
        : null
    }
  });
  res.send(result);
});

router.delete('/image', [auth], async (req, res) => {
  const result = await prisma.user.update({
    where: { id: req.user.id },
    data: { image: '' }
  });
  res.send(result);
});

module.exports = router;
