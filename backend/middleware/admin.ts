import AppError from '../utils/AppError';

export default (req: any, res: any, next: any) => {
  if (process.env.REQUIRES_AUTH === 'false') return next();

  if (!req.user.isAdmin) {
    throw new AppError('Access denied. Admin privileges required.', 403);
  }

  next();
};
