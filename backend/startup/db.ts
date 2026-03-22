const logger = require('../utils/logger');
const prisma = require('../db');

module.exports = async () => {
  try {
    await prisma.$connect();
    logger.info(`Connected to PostgreSQL via Prisma`);
  } catch (err) {
    logger.error(`Failed to connect to db`, err);
  }
};
