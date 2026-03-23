import express from 'express';
const router = express.Router();
import prisma from '../db';
import auth from '../middleware/auth';
import admin from '../middleware/admin';

router.get('/', [auth, admin], async (req: any, res: any) => {
  try {
    const logs = await (prisma as any).systemLog.findMany({
      orderBy: { timestamp: 'desc' as const },
      take: 250, // Display the most recent 250 log events
    });

    // Send data structured beautifully for the frontend
    res.send({ success: true, count: logs.length, data: logs });
  } catch (error) {
    console.error('Failed fetching audit logs:', error);
    res.status(500).send({ success: false, message: 'Could not fetch logs.' });
  }
});

export default router;
