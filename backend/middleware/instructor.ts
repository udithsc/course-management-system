import AppError from '../utils/AppError';

export default function instructor(req: any, res: any, next: any) {
  const role = req.user?.role;
  if (role === 'INSTRUCTOR' || role === 'ADMIN') return next();
  throw new AppError('Access denied. Instructor or Admin role required.', 403);
}
