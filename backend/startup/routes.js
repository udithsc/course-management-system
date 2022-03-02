const express = require('express');
const auth = require('../routes/auth');
const users = require('../routes/users');
const courses = require('../routes/courses');
const categories = require('../routes/categories');
const authors = require('../routes/authors');
const error = require('../middleware/error');

module.exports = (app) => {
  app.use(express.json());
  app.get('/', (req, res) => res.send('its working!'));
  app.use('/api/auth', auth);
  app.use('/api/users', users);
  app.use('/api/courses', courses);
  app.use('/api/categories', categories);
  app.use('/api/authors', authors);
  app.use(error);
};
