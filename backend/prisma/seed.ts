require('dotenv').config();
const prisma = require('../db');
const bcrypt = require('bcryptjs');

const SAMPLE_VIDEOS = [
  {
    title: 'Introduction to Web Development',
    description: 'Overview of what we will cover in this course — HTML, CSS, JavaScript, and modern frameworks.',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  },
  {
    title: 'HTML Fundamentals',
    description: 'Learn the building blocks of every webpage: tags, attributes, semantic HTML5 elements.',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  },
  {
    title: 'CSS Styling & Layouts',
    description: 'Master Flexbox, CSS Grid, responsive design, and modern CSS techniques.',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  },
  {
    title: 'JavaScript Essentials',
    description: 'Variables, functions, DOM manipulation, events, and asynchronous JS (promises, async/await).',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  },
  {
    title: 'Building Your First Project',
    description: 'Put everything together and build a real portfolio-ready project from scratch.',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
  },
];

async function main() {
  console.log('🌱 Starting database seed...\n');

  // ─── Passwords ─────────────────────────────────────────────────────────────
  const adminPassword      = await bcrypt.hash('admin123', 10);
  const instructorPassword = await bcrypt.hash('instructor123', 10);
  const studentPassword    = await bcrypt.hash('student123', 10);

  // ─── 1. Admin ───────────────────────────────────────────────────────────────
  const admin = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: { role: 'ADMIN', isAdmin: true, isVerified: true },
    create: {
      username:   'admin',
      email:      'admin@test.com',
      firstName:  'Super',
      lastName:   'Admin',
      mobile:     '0100000001',
      password:   adminPassword,
      role:       'ADMIN',
      isAdmin:    true,
      isVerified: true,
    },
  });
  console.log('✅ Admin created:', admin.email);

  // ─── 2. Instructor ──────────────────────────────────────────────────────────
  const instructorUser = await prisma.user.upsert({
    where: { email: 'instructor@test.com' },
    update: { role: 'INSTRUCTOR', isVerified: true },
    create: {
      username:   'johndoe_teaches',
      email:      'instructor@test.com',
      firstName:  'John',
      lastName:   'Doe',
      mobile:     '0100000002',
      password:   instructorPassword,
      role:       'INSTRUCTOR',
      isAdmin:    false,
      isVerified: true,
    },
  });
  console.log('✅ Instructor user created:', instructorUser.email);

  // ─── 3. Author profile linked to instructor ─────────────────────────────────
  const instructor = await prisma.author.upsert({
    where: { userId: instructorUser.id },
    update: {},
    create: {
      name:       'John Doe',
      profession: 'Senior Web Developer & Educator',
      email:      'instructor@test.com',
      mobile:     '0100000002',
      userId:     instructorUser.id,
    },
  });
  console.log('✅ Author/Instructor profile created:', instructor.name);

  // ─── 4. Student ─────────────────────────────────────────────────────────────
  const student = await prisma.user.upsert({
    where: { email: 'student@test.com' },
    update: { role: 'STUDENT', isVerified: true },
    create: {
      username:   'jane_learns',
      email:      'student@test.com',
      firstName:  'Jane',
      lastName:   'Smith',
      mobile:     '0100000003',
      password:   studentPassword,
      role:       'STUDENT',
      isAdmin:    false,
      isVerified: true,
    },
  });
  console.log('✅ Student created:', student.email);

  // ─── 5. Category ────────────────────────────────────────────────────────────
  const category = await prisma.category.upsert({
    where: { name: 'Web Development' },
    update: {},
    create: {
      name: 'Web Development',
      icon: 'Code',
    },
  });
  console.log('✅ Category created:', category.name);

  // ─── 6. Sample Course ───────────────────────────────────────────────────────
  const existingCourse = await prisma.course.findUnique({ where: { name: 'Complete Web Development Bootcamp' } });
  
  let course;
  if (existingCourse) {
    course = existingCourse;
    console.log('ℹ️  Course already exists, skipping creation');
  } else {
    course = await prisma.course.create({
      data: {
        name:        'Complete Web Development Bootcamp',
        description: 'A comprehensive bootcamp covering modern web development from scratch. You will learn HTML, CSS, JavaScript, and build real-world projects. Perfect for beginners and those looking to level up their skills.',
        fee:         0,          // Free for MVP testing
        language:    'English',
        authorId:    instructor.id,
        categoryId:  category.id,
      },
    });
    console.log('✅ Course created:', course.name);

    // ─── 7. Lessons ─────────────────────────────────────────────────────────
    for (const video of SAMPLE_VIDEOS) {
      await prisma.lesson.create({
        data: {
          courseId:    course.id,
          title:       video.title,
          description: video.description,
          url:         video.url,
        },
      });
    }
    console.log(`✅ ${SAMPLE_VIDEOS.length} lessons created`);

    // ─── 8. Sample Reviews ─────────────────────────────────────────────────
    await prisma.review.create({
      data: {
        courseId: course.id,
        userId:   student.id,
        rating:   5,
        comment:  'Absolutely fantastic course! John explains everything so clearly. Highly recommended for any beginner!',
        time:     new Date().toISOString(),
      },
    });
    await prisma.review.create({
      data: {
        courseId: course.id,
        userId:   admin.id,
        rating:   4,
        comment:  'Great content and well-structured. Would love even more advanced topics in a follow-up course.',
        time:     new Date().toISOString(),
      },
    });
    console.log('✅ Sample reviews created');
  }

  // ─── 9. Student Subscription (with some progress) ───────────────────────────
  const existingSub = await prisma.subscription.findFirst({
    where: { userId: student.id, courseId: course.id },
  });

  if (!existingSub) {
    // Fetch first 2 lessons to simulate progress
    const lessons = await prisma.lesson.findMany({ where: { courseId: course.id }, take: 2 });
    
    await prisma.subscription.create({
      data: {
        userId:        student.id,
        courseId:      course.id,
        watchedVideoId: lessons.map((l) => l.id),
      },
    });

    await prisma.course.update({
      where: { id: course.id },
      data:  { subscriptions: { increment: 1 } },
    });

    console.log('✅ Student enrolled with partial progress (2/5 lessons)');
  } else {
    console.log('ℹ️  Student already enrolled, skipping');
  }

  console.log('\n🎉 Seed complete! Test accounts:');
  console.log('─────────────────────────────────────────────');
  console.log('👑 ADMIN      → admin@test.com        / admin123');
  console.log('👨‍🏫 INSTRUCTOR → instructor@test.com   / instructor123');
  console.log('👩‍🎓 STUDENT    → student@test.com      / student123');
  console.log('─────────────────────────────────────────────');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
