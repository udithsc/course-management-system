const router = require('express').Router();
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const AppError = require('../utils/AppError');
const { success, created, paginated, message } = require('../utils/response');
const { validateModel } = require('../models/user.model');
const { createUpload, getFileUrl } = require('../utils/upload');
const prisma = require('../db');

const upload = createUpload('users');

// Fields to return for user queries (never include password)
const USER_SELECT = {
  id: true,
  username: true,
  email: true,
  firstName: true,
  lastName: true,
  mobile: true,
  role: true,
  dob: true,
  image: true,
  bookmarks: true,
  isVerified: true,
  isAdmin: true,
  createdAt: true,
  updatedAt: true,
};

// ─── List Users (paginated) ─────────────────────────────
router.get('/', [auth], async (req, res) => {
  const pageNo = parseInt(req.query.pageNo, 10) || 0;
  const pageSize = parseInt(req.query.pageSize, 10) || 10;
  const name = req.query.name || '';

  const where = {
    firstName: { contains: name, mode: 'insensitive' },
  };

  const totalElements = await prisma.user.count({ where });
  const totalPages = Math.ceil(totalElements / pageSize);

  const data = await prisma.user.findMany({
    where,
    skip: pageNo * pageSize,
    take: pageSize,
    orderBy: { firstName: 'asc' },
    select: USER_SELECT,
  });

  return paginated(res, { data, totalElements, pageNo, totalPages });
});

// ─── Create User ────────────────────────────────────────
router.post('/', [auth, admin, validate(validateModel)], async (req, res) => {
  const { username, email, firstName, lastName, mobile } = req.body;

  const user = await prisma.user.create({
    data: {
      username,
      email,
      firstName,
      lastName,
      mobile: mobile ? mobile.toString() : '',
    },
    select: USER_SELECT,
  });

  return created(res, user);
});

// ─── Update User ────────────────────────────────────────
router.put('/:id', [auth, admin, validate(validateModel)], async (req, res) => {
  // Never allow password to be set through this endpoint
  const { password, ...updateData } = req.body;

  try {
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: updateData,
      select: USER_SELECT,
    });
    return success(res, user);
  } catch (e) {
    throw new AppError('User not found.', 404);
  }
});

// ─── Delete User ────────────────────────────────────────
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    return message(res, 'User deleted successfully.');
  } catch (e) {
    throw new AppError('User not found.', 404);
  }
});

// ─── Change User Role ───────────────────────────────────
router.patch('/:id/role', [auth, admin], async (req, res) => {
  const { role } = req.body;
  const VALID_ROLES = ['ADMIN', 'INSTRUCTOR', 'STUDENT'];
  if (!VALID_ROLES.includes(role)) {
    throw new AppError(`Invalid role. Must be one of: ${VALID_ROLES.join(', ')}`, 400);
  }

  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: {
      role,
      isAdmin: role === 'ADMIN',
    },
    select: USER_SELECT,
  });

  return success(res, user);
});

// ─── Get Current User ───────────────────────────────────
router.get('/me', [auth], async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { ...USER_SELECT, subscriptions: true },
  });
  if (!user) throw new AppError('User not found.', 404);
  return success(res, user);
});

// ─── Close Account ──────────────────────────────────────
router.delete('/closeAccount', [auth], async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: req.user.id } });
    return message(res, 'Account closed successfully.');
  } catch (e) {
    throw new AppError('Error closing account.', 400);
  }
});

// ─── Dashboard Data ─────────────────────────────────────
router.get('/dashboard', [auth], async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { ...USER_SELECT, subscriptions: true },
  });
  if (!user) throw new AppError('User not found.', 404);

  const courses = await prisma.course.findMany({
    include: { lessons: true },
  });

  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
  });

  const subscriptions = user.subscriptions
    .map((sub) => {
      const subCourse = courses.find((o) => o.id === sub.courseId);
      if (!subCourse) return null;
      const subCategory = categories.find((o) => o.id === subCourse.categoryId);
      const percentage =
        subCourse.lessons.length > 0
          ? (sub.watchedVideoId.length / subCourse.lessons.length) * 100
          : 0;

      return {
        id: sub.courseId,
        name: subCourse.name,
        percentage: Math.round(percentage),
        category: subCategory?.name,
      };
    })
    .filter(Boolean);

  return success(res, {
    user,
    subscriptions,
    courses,
    categories,
    developerPicks: courses,
  });
});

// ─── Subscribe to Course ────────────────────────────────
router.post('/subscribe', [auth], async (req, res) => {
  const courseId = req.body.course || req.body.id;
  if (!courseId) throw new AppError('Course ID is required.', 400);

  const existingSub = await prisma.subscription.findFirst({
    where: { userId: req.user.id, courseId },
  });

  if (!existingSub) {
    await prisma.subscription.create({
      data: { userId: req.user.id, courseId },
    });

    await prisma.course.update({
      where: { id: courseId },
      data: { subscriptions: { increment: 1 } },
    });
  }

  return message(res, 'Subscribed successfully.');
});

// ─── Unsubscribe from Course ────────────────────────────
router.post('/unsubscribe', [auth], async (req, res) => {
  const courseId = req.body.id;
  if (!courseId) throw new AppError('Course ID is required.', 400);

  const existingSub = await prisma.subscription.findFirst({
    where: { userId: req.user.id, courseId },
  });

  if (existingSub) {
    await prisma.subscription.delete({ where: { id: existingSub.id } });
    await prisma.course.update({
      where: { id: courseId },
      data: { subscriptions: { decrement: 1 } },
    });
  }

  return message(res, 'Unsubscribed successfully.');
});

// ─── Bookmark Course ────────────────────────────────────
router.post('/bookmark', [auth], async (req, res) => {
  const { id } = req.body;
  if (!id) throw new AppError('Course ID is required.', 400);

  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!user) throw new AppError('User not found.', 404);

  if (!user.bookmarks.includes(id)) {
    await prisma.user.update({
      where: { id: req.user.id },
      data: { bookmarks: { push: id } },
    });
  }

  return message(res, 'Bookmark added.');
});

// ─── Remove Bookmark ────────────────────────────────────
router.delete('/bookmark/:id', [auth], async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!user) throw new AppError('User not found.', 404);

  await prisma.user.update({
    where: { id: req.user.id },
    data: { bookmarks: user.bookmarks.filter((b) => b !== req.params.id) },
  });

  return message(res, 'Bookmark removed.');
});

// ─── Mark Video as Watched ──────────────────────────────
router.post('/watch', [auth], async (req, res) => {
  const { id, video } = req.body;
  if (!id || !video) throw new AppError('Course ID and video ID are required.', 400);

  const sub = await prisma.subscription.findFirst({
    where: { userId: req.user.id, courseId: id },
  });
  if (!sub) throw new AppError('You are not subscribed to this course.', 400);

  if (!sub.watchedVideoId.includes(video)) {
    await prisma.subscription.update({
      where: { id: sub.id },
      data: { watchedVideoId: { push: video } },
    });
  }

  return message(res, 'Video marked as watched.');
});

// ─── Upload Profile Image ───────────────────────────────
router.post('/image', [auth, upload.single('file')], async (req, res) => {
  const result = await prisma.user.update({
    where: { id: req.user.id },
    data: {
      image: req.file?.filename
        ? getFileUrl(req, 'users', req.file.filename)
        : null,
    },
    select: USER_SELECT,
  });
  return success(res, result);
});

// ─── Remove Profile Image ───────────────────────────────
router.delete('/image', [auth], async (req, res) => {
  const result = await prisma.user.update({
    where: { id: req.user.id },
    data: { image: '' },
    select: USER_SELECT,
  });
  return success(res, result);
});

module.exports = router;
