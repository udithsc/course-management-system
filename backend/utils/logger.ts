import { createLogger, transports, format } from 'winston';
import Transport from 'winston-transport';
const { combine, timestamp, colorize, simple } = format;
import prisma from '../db';

class PrismaTransport extends Transport {
  constructor(opts) {
    super(opts);
  }
  log(info: any, callback: () => void) {
    setImmediate(() => {
      this.emit('logged', info);
    });

    const level = info.level || 'info';
    const message = info.message || '';

    // Prevent logging DB connection errors to prevent infinite loops
    if (message.includes('PrismaClient') || typeof message !== 'string') {
      callback();
      return;
    }

    if (!(prisma as any)?.systemLog) {
      // Fallback gracefully so we don't crash the server
      console.log(`[Winston Fallback] ${level}: ${message}`);
      callback();
      return;
    }

    (prisma as any).systemLog
      .create({
        data: {
          level,
          message,
        },
      })
      .catch((err: any) => {
        console.error('Winston-Prisma Sync Error:', err.message);
      });

    callback();
  }
}

const logger = createLogger({
  level: 'info',
  format: combine(timestamp(), format.json()),
  transports: [
    new transports.Console({
      format: combine(colorize(), simple()),
    }),
    new PrismaTransport({
      handleExceptions: true,
      handleRejections: true,
    }),
  ],
  exitOnError: false, // DON'T exit on logger errors
});

export default logger;
