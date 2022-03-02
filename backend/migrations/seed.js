const bcrypt = require('bcryptjs');

module.exports = {
  async up(db, client) {
    await db.collection('categories').insertMany([
      {
        name: 'English',
        icon: 'http://localhost:3001/resources/category.png'
      },
      {
        name: 'Science',
        icon: 'http://localhost:3001/resources/category.png'
      }
    ]);

    await db.collection('authors').insertMany([
      {
        name: 'John Smith',
        profession: 'Teacher',
        email: 'teacher@gmail.com',
        mobile: 777123456,
        image: 'http://localhost:3001/resources/user.png'
      }
    ]);

    const password = await bcrypt.hash('12345', 10);

    await db.collection('users').insertMany([
      {
        username: 'JohnD',
        firstName: 'John',
        lastName: 'Doe',
        email: 'teacher@gmail.com',
        mobile: 777123456,
        isAdmin: true,
        image: 'http://localhost:3001/resources/user.png',
        password
      }
    ]);
  }
};
