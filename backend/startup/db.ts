import logger from '../utils/logger';
import prisma from '../db';

export default async () => {
  try {
    await prisma.$connect();
    logger.info(`Connected to PostgreSQL via Prisma`);
  } catch (err) {
    logger.error(`Failed to connect to db`, err);
  }
};
