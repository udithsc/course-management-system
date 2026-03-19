const prisma = require('../db');
const bcrypt = require('bcryptjs');

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@test.com',
      firstName: 'Super',
      lastName: 'Admin',
      mobile: '0123456789',
      password: adminPassword,
      isAdmin: true,
      isVerified: true
    },
  });

  console.log('Admin user created:', admin.email, 'password: admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
