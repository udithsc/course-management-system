const mongoose = require('mongoose');
const config = require('config');
const logger = require('../utils/logger');

module.exports = async () => {
  const db = process.env.DB_URL || config.get('db');
  await mongoose.connect(db);
  logger.info(`Connected to db`);
};
